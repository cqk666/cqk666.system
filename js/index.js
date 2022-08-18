var a = new Vue({
    el: "#form",
    data:{
        name:"",
        n_id:"",
        remark:"",
        address:"",
        hetong:"",
        total_money:0,
        total_number:0,
        total_area:0,
        order_main:[],
        order_detail:[],
        sum_list:[],
    },
    mounted(){
        var that = this;
        axios.get("http://192.168.3.26:8080/get_all_order_main")
                .then(response => {
                    that.order_main = response.data.data
                    for (var i = 0; i < that.order_main.length; i++) {
                        that.order_main[i].date = dateParse(that.order_main[i].date * 1000);
                        if(that.order_main[i].status==0){
                            that.order_main[i].status = "未支付"
                        }else{
                            that.order_main[i].status = "已支付"
                        };
                        that.total_money = this.total_money+(Number(that.order_main[i].total));
                        that.total_number = this.total_number+ (Number(that.order_main[i].count));
                        that.total_area = this.total_area +(Number(that.order_main[i].area));
                    }
                    that.total_money = that.total_money.toFixed(2);
                    that.total_number = that.total_number.toFixed(0);
                    that.total_area = that.total_area.toFixed(2);
                })
    },
    methods: {
        get_main:function(){
            var that = this;
            axios.get("http://localhost:8080/get_all_order_main")
                .then(response => {
                    that.order_main = response.data.data
                    for (var i = 0; i < that.order_main.length; i++) {
                        that.order_main[i].date = dateParse(that.order_main[i].date * 1000);
                        if(that.order_main[i].status==0){
                            that.order_main[i].status = "未支付"
                        }else{
                            that.order_main[i].status = "已支付"
                        };
                    }
                })
        },
        get_add_form: function () {
            var name = document.getElementById("name").value;
            var address = document.getElementById("address").value;
            var remark = document.getElementById("remark").value;
            var hetong = document.getElementById("hetong").value;
            var date = Math.round(new Date().getTime()/1000);
            axios({
                url: "http://localhost:8080/add_new_order",
                        method: "post",
                        contentType: "application/json",
                        data:{
                            name:name,
                            address:address,
                            date:date,
                            remark:remark,
                            hetong:hetong
                        },
                    }).then(function (response) {
                        alert("添加成功");
                    });
            axios.get("http://localhost:8080/get_all_order_main")
                .then(response => {
                    that.order_main = response.data.data
                    for (var i = 0; i < that.order_main.length; i++) {
                        that.order_main[i].date = dateParse(that.order_main[i].date * 1000);
                        if(that.order_main[i].status==0){
                            that.order_main[i].status = "未支付"
                        }else{
                            that.order_main[i].status = "已支付"
                        }
                    }
                })
        },
        go_index: function () {
            document.getElementById("index_form").style.display = "block";
            document.getElementById("add_form").style.display = "none";
        },
        get_detail:function(name,address,n_id,remark){
            var that = this;
            document.getElementById("index_form").style.display = "none";
            document.getElementById("add_form").style.display = "block";
            this.name = name;
            this.address = address;
            this.n_id = n_id,
            this.remark = remark
            axios({
                url: "http://localhost:8080/get_order_by_n_id",
                        method: "post",
                        contentType: "application/json",
                        data:{
                            n_id:n_id
                        },
                    }).then(function (response) {
                        that.order_detail =  response.data.data
                    });
        },
        create_new_order:function(){
            var width = document.getElementById("width").value;
            var height = document.getElementById("height").value;
            var number = document.getElementById("number")[document.getElementById("number").selectedIndex].value;
            var price = document.getElementById("price").value;
            var material = document.getElementById("material").value;
            var color = document.getElementById("color")[document.getElementById("color").selectedIndex].value;
            var door_style = document.getElementById("door_style").value;
            var open_style = document.getElementById("open_style")[document.getElementById("open_style").selectedIndex].value;
            var hand = document.getElementById("hand")[document.getElementById("hand").selectedIndex].value;
            var site  = document.getElementById("site")[document.getElementById("site").selectedIndex].value;
            var n_id = this.n_id;
            axios({
                url: "http://localhost:8080/create_new_order",
                method: "post",
                contentType: "application/json",
                data:{
                    width:width,
                    height:height,
                    number:number,
                    price:price,
                    material:material,
                    color:color,
                    door_style:door_style,
                    open_direction:open_style,
                    hand:hand,
                    site:site,
                    n_id:n_id,
                },
            }).then(function (response) {
                alert("添加成功");
            });
            this.get_detail;
        },
        serach_by_hetong_or_n_id:function(){
            var that = this;
            var text = document.getElementById("search").value;
            alert(text)
            axios({
                url: "http://localhost:8080/search_by_hetong_or_n_id",
                method: "post",
                contentType: "application/json",
                data:{
                    search:text
                },
            }).then(function (response) {
                alert("查找成功");
                that.order_main = response.data.data
                for (var i = 0; i < that.order_main.length; i++) {
                    that.order_main[i].date = dateParse(that.order_main[i].date * 1000);
                    if(that.order_main[i].status==0){
                        that.order_main[i].status = "未支付"
                    }else{
                        that.order_main[i].status = "已支付"
                    };
                    that.total_money = this.total_money+(Number(that.order_main[i].total));
                    that.total_number = this.total_number+ (Number(that.order_main[i].count));
                    that.total_area = this.total_area +(Number(that.order_main[i].area));
                }
            });
        },
        search_by_date_for_order:function(){
            var that = this;
            var m = this;
            var startTime_list = new Date(document.getElementById("startTime_list").value)/1000;
            var endTime_list = new Date(document.getElementById("endTime_list").value)/1000;
            axios({
                url: "http://localhost:8080/search_by_date_for_order",
                method: "post",
                contentType: "application/json",
                data:{
                    startTime_list:startTime_list,
                    endTime_list:endTime_list,
                },
            }).then(function (response) {
                alert("查找成功");
                that.order_main = response.data.data
                for (var i = 0; i < that.order_main.length; i++) {
                    that.order_main[i].date = dateParse(that.order_main[i].date * 1000);
                    if(that.order_main[i].status==0){
                        that.order_main[i].status = "未支付"
                    }else{
                        that.order_main[i].status = "已支付"
                    };
                }
            });
            axios({
                url: "http://localhost:8080/get_sum",
                method: "post",
                contentType: "application/json",
                data:{
                    startTime_list:startTime_list,
                    endTime_list:endTime_list,
                },
            }).then(function (response) {
                m.sum_list = response.data.data;
                // console.log(list)
                for (var i = 0; i < m.sum_list.length; i++) {
                    m.total_money = (Number(m.sum_list[i].total)).toFixed(2);
                    m.total_number = (Number(m.sum_list[i].count)).toFixed(2);
                    m.total_area = (Number(m.sum_list[i].area)).toFixed(2);
                }
            });
        },
        have_pay:function(n_id){
            axios({
                url: "http://localhost:8080/have_pay",
                method: "post",
                contentType: "application/json",
                data:{
                    n_id:n_id
                },
            }).then(function (response) {
                alert("修改成功")
            });
        },
        no_pay:function(n_id){
            axios({
                url: "http://localhost:8080/no_pay",
                method: "post",
                contentType: "application/json",
                data:{
                    n_id:n_id
                },
            }).then(function (response) {
                alert("修改成功")
            });
        },
        delete_order:function(n_id){
            alert(n_id)
            var n_id = n_id;
            axios({
                url: "http://localhost:8080/delete_order_main",
                method: "post",
                contentType: "application/json",
                data:{
                    n_id:n_id
                },
            }).then(function (response) {
                alert("删除成功")
            });
        }
    }
})
function dateParse(dataString) {
    if (dataString) {
        let date = new Date(dataString);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y + M + D + h + m + s;
    } else {
        return '';
    }
}