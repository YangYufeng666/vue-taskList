var store = {
	save(key, value) {
		localStorage.setItem(key, JSON.stringify(value));
	},
	fecth(key) {
		return JSON.parse(localStorage.getItem(key)) || [];
	}
}
var filter = {
	all: function(list) {
		return list;
	},
	unfinshed: function(list) {
		return list.filter(function(item) {
			return !item.isChecked;
		});
	},
	finshed: function(list) {
		return list.filter(function(item) {
			return item.isChecked;
		});
	}
}
var list = store.fecth("list");
var vm = new Vue({
	el: "#app",
	data: {
		list: list,
		todo: "",
		//记录正在编辑的任务
		isEdit: "",
		//记录编辑之前的数据
		beforeEdit: "",
		visibility: "all"
	},
	//监控属性值
	watch: {
		//监控list这个属性
		//浅监控
		/*
		list:function(){
			store.save("list",this.list);
		}*/
		//深度监控
		list: {
			handler: function() {
				store.save("list", this.list);
			},
			deep: true
		}
	},
	methods: {
		//向list中添加一项
		addTask() {
			this.list.push({
				title: this.todo,
				isChecked: false
			});
			this.todo = "";
			window.location.reload();			
		},
		//删除任务
		deleteItem(item) {
			var index = this.list.indexOf(item);
			this.list.splice(index, 1);
		},
		//编辑任务
		editItem(item) {
			if(!item.isChecked) {
				this.isEdit = item;
				this.beforeEdit = item.title;
			}

		},
		//编辑完成
		edited(item) {
			this.isEdit = "";
		},
		//取消编辑任务
		cancelItem(item) {
			//记录编辑之前的数据
			item.title = this.beforeEdit;
			this.beforeEdit = "";
			this.isEdit = "";
		}

	},
	directives: {
		focus: {
			update(el, binging) {
				if(binging.value) {
					el.focus();
				}
			}
		}
	},
	computed: {
		noCheckedLength() {
			return this.list.filter(function(item) {
				return !item.isChecked;
			}).length;
		},
		filterList() {

			return filter[this.visibility] ? filter[this.visibility](list) : list;
		}
	}
})

function hashChange() {
	var hash = window.location.hash.slice(1);
	vm.visibility = hash;
}
hashChange();
window.addEventListener("hashchange", hashChange)