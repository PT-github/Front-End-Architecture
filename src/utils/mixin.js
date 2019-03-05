import Vue from 'vue'
import storage from "./storage";
const mixin = {
  data() {
    return {
      // 数据字典
      dicObj: null,
      // dicObj: {
      //   // 学段
      //   stageType: [
      //     { name: '小学', value:  1},
      //     { name: '初中', value:  2},
      //     { name: '高中', value:  3}
      //   ],
      //   // 学校认证状态
      //   accountType: [
      //     { name: '正式账号', value: 1 },
      //     { name: '试用账号', value: 2 }
      //   ]
      // },
      $_loading: false,
      $_loadingObj: null
    }
  },
  created() {
    storage.getItem('dic') && !this.dicObj && (this.dicObj = JSON.parse(storage.getItem('dic')));
  },
  methods: {
    $_setDic() {
      storage.getItem('dic') && !this.dicObj && (this.dicObj = JSON.parse(storage.getItem('dic')));
    },
    /**
     * 根据数据字典的key值，找到对应value的中文名称
     * @param {String} typeKey 数据字典类型值
     * @param {String} enumValue 数据字典enumValue值
     * (直传typeKey返回所有这个类型的数组, 两个参数都传则返回一个字段)
     */
    dicFormater(typeKey, enumValue) {
      if (!typeKey && !enumValue) {
        return '';
      } else if (typeKey && !enumValue) {
        return this.dicObj.filter((item) => {
          return item.typeKey === typeKey;
        });
      } else if (typeKey && enumValue) {
        const typeList = this.dicObj.filter((item) => {
          return item.typeKey === typeKey;
        }).filter((item) => {
          return item.enumValue == enumValue;
        }).map((item) => {
          return item.enumField;
        });
        if (typeList.length) {
          return typeList[0];
        } else {
          return '';
        }
      }
      return '';
    },
    $_hideLoading() {
      if (this.$_loading) {
        this.$_loadingObj.close()
        this.$_loading = false
      }
    },
    $_showLoading(options = {}) {
      if (!this.$_loading) {
        this.$_loadingObj = this.$loading({
          lock: true,
          text: options.text || '加载中...',
          target: options.target || 'document.body',
          spinner: 'el-icon-loading',
          fullscreen: options.target ? false : true,
          background: options.background || 'rgba(0, 0, 0, 0.1)',
          customClass: options.customClass || 'customClass'
        })
        this.$_loading = true
      }
    }
  }
}
Vue.mixin(mixin)
export const dbMixin = {
  data() {
    return {
      indexedDB: null, // 数据库实例
      options: {
        databaseName: 'education-front-web',
        version: 1
      },
      db: null, // 数据库连接对象
      connectSuccess: false, // 数据库连接成功标志
    }
  },
  created() {
    this.$_initDB()
  },
  methods: {
    /**
     * 初始化indexedDB
     */
    $_initDB() {
      this.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
      if (!this.indexedDB) {
        alert('很抱歉，您的浏览器版本太低，系统暂不支持，请升级或更换浏览器！')
      } else {
        console.log('数据库初始化成功...')
      }
    },
    /**
     * 先删除数据库，然后连接（创建）数据库
     * @param {Object} param0 
     *    @param {String} databaseName 数据库名称
     *    @param {Number} version 数据库版本
     *    @param {Array} tableList 需要新建的表格 tableList = [{tablename: 'tablename', options: {keyPath: 'id', autoIncrement: true}}]
     */
    $_connectDB({ databaseName = '', version = '', tableList = [] } = {}) {
      let _this = this
      databaseName && (this.options.databaseName = databaseName)
      version && (this.options.version = version)
      this.$_deleteDB().then(() => {
        let request = _this.indexedDB.open(_this.options.databaseName, _this.options.version);
        request.onerror = function (event) {
          console.log('数据库打开报错', event);
          _this.connectSuccess = false
        };
        request.onsuccess = function () {
          _this.db = request.result;
          _this.connectSuccess = true
          console.log('数据库连接成功', _this.db.version)
        };
        request.onupgradeneeded = function (event) {
          _this.db = event.target.result;
          // 新增表格
          for (let i = 0; i < tableList.length; i++) {
            if (!_this.db.objectStoreNames.contains(tableList[i].tablename)) {
              console.log(`创建了${tableList[i].tablename}`)
              _this.db.createObjectStore(tableList[i].tablename, tableList[i].options || {});
            }
          }
          console.log('数据库更新成功')
        }
      })
    },
    /**
     * 通过表名和主键查询数据
     * @param {String} storename 表名
     * @param {Array|Number} key 数据的主键
     */
    $_select(storename, key) {
      let store = this.db.transaction(storename, 'readwrite').objectStore(storename);
      if (Array.isArray(key)) {
        for (let i = 0; i < key.length; i++) {
          this._getDataByKey(store, key[i])
        }
      } else {
        this._getDataByKey(store, key)
      }
    },
    _getDataByKey(store, key) {
      let request = store.get(key)
      request.onerror = function (event) {
        console.log('查询事务失败', event);
      };
      request.onsuccess = function () {
        if (request.result) {
          console.log('查询出的数据是：', request.result);
        } else {
          console.log('未获得数据记录');
        }
      };
    },
    /**
     * 通过表名和主键删除数据
     * @param {String} storename 表名
     * @param {Array|Number} key 删除数据的主键
     */
    $_delete(storename, key) {
      let store = this.db.transaction(storename, 'readwrite').objectStore(storename);
      if (Array.isArray(key)) {
        for (let i = 0; i < key.length; i++) {
          this._deleteData(store, key[i])
        }
      } else {
        this._deleteData(store, key)
      }
    },
    _deleteData(store, key) {
      let request = store.delete(key)
      request.onsuccess = function () {
        console.log('数据删除成功', key)
      }
    },
    /**
     * 通过表名更新数据
     * @param {String} storename 表名
     * @param {Array|Object} data 更新的数据
     */
    $_update(storename, data) {
      let store = this.db.transaction(storename, 'readwrite').objectStore(storename);
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          this._updateData(store, data[i])
        }
      } else {
        this._updateData(store, data)
      }
    },
    _updateData(store, data) {
      let request = store.put(data)
      request.onsuccess = function () {
        console.log('数据更新成功', data)
      }
      request.onerror = function () {
        console.error('数据更新失败', data)
      }
    },
    /**
     * 通过表名插入数据
     * @param {String} storename 表名
     * @param {Array|Object} data 插入的数据
     */
    $_addData(storename, data) {
      //添加数据，重复添加会报错
      let store = this.db.transaction(storename, 'readwrite').objectStore(storename);
      if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          this._addData(store, data[i])
        }
      } else {
        this._addData(store, data)
      }
    },
    _addData(store, data) {
      let request = store.add(data);
      request.onerror = function () {
        console.error('add添加数据库中已有该数据')
      };
      request.onsuccess = function () {
        console.log('add添加数据已存入数据库')
      };
    },
    // /**
    //  * 删除数据库仓库
    //  */
    // $_deleteTable () {
    //   console.log(this.db.objectStoreNames)
    //   for (let i = 0; i < this.db.objectStoreNames.length; i++) {
    //     console.log(`删除了表格${this.db.objectStoreNames[i]}`)
    //     this.db.deleteObjectStore(this.db.objectStoreNames[i])
    //   }
    // },
    /**
     * 关闭数据库
     */
    $_closeDB() {
      this.db.close();
      console.log('数据库已关闭')
    },
    /**
     * 删除数据库
     * @param {String} databaseName 数据库名称
     */
    $_deleteDB(databaseName = '') {
      return new Promise(resolve => {
        this.connectSuccess && this.$_closeDB()
        let DBDeleteRequest = this.indexedDB.deleteDatabase(databaseName || this.options.databaseName);
        DBDeleteRequest.onsuccess = function () {
          console.log(`数据库删除成功`)
          resolve()
        }
      })
    }
  }
}