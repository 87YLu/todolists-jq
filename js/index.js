// !! 左侧宽度调整开始
let startX, startWidth;

const getScalableDivWidth = () => {
  return startWidth = parseInt($(".scalable").width(), 10);
};

startWidth = localStorage.getItem("scalableWidth") || getScalableDivWidth();

let scalable = $(".scalable");
let separator = $(".separator");
let body = $("html");

$(".scalable").width(startWidth);

const onDrag = (e) => {
  separator.css("cursor", "col-resize");
  scalable.width(startWidth + e.clientX - startX);
};

const stopDrag = () => {
  separator.css("cursor", "");
  localStorage.setItem("scalableWidth", getScalableDivWidth())
  body.off("mousemove", onDrag);
  body.off("mouseup", stopDrag);
};

const startDrag = (e) => {
  startX = e.clientX;
  startWidth = getScalableDivWidth();
  body.on("mousemove", onDrag);
  body.on("mouseup", stopDrag);
};

separator.on("mousedown", startDrag);

// 左侧宽度调整结束

//  封装移除项目的函数
const removeItem = (obj, target) => {
  if (obj instanceof Array) {
    let index = obj.indexOf(target);
    obj.splice(index, 1);
  } else {
    delete obj[target];
  }
}

// !! 错误提示部分
const showMes = (value) => {
  $("#mes .modal-content").html(value);
  $("#mes").modal("show");
  setTimeout(function () {
    $("#mes").modal("hide");
  }, 1000);
}

// !! 登录和注册的错误提示
const showLogonMes = (value) => {
  $("#logon").modal("hide");
  showMes(value);
  setTimeout(function () {
    $("#logon").modal("show")
  }, 1000);
}
// !! 清除账号密码框数据
const clearInputData = () => {
  $(".zhanghao").val("");
  $(".mima").val("");
}
// !! 用户部分开始


// 加载管理清单
const loadUsersManagementList = () => {
  $(".users").html("");
  let arr = JSON.parse(localStorage.getItem("managed-users")) || [];
  for (let i = 0, len = arr.length; i < len; i++) {
    $(".users").append($(`<li>${arr[i]}<span>注销</span></li>`));
  }
}
// 初始化用户名和清单
$(".user").html(localStorage.getItem("now-user") || "未登录");
loadUsersManagementList();
// 控制组件出现
$(".user").on("click", function () {
  $("#users-management").modal("show");
})
$(".add-user").on("click", function () {
  $("#users-management").modal("hide");
  setTimeout(function () {
    $("#logon").modal("show");
  }, 500);
})
// 获取已经注册的用户名
const getUsersArr = () => {
  let arr = JSON.parse(localStorage.getItem("users")) || [];
  let usersArr = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    usersArr.push(arr[i].user);
  }
  return usersArr;
}

// 切换登录和注册
$("#logon .toggle").on("click", function () {
  if ($(this).html() == "注册") {
    $(this).html("登录");
    $("#logon .logon-btn").html("注册");
    clearInputData();
  } else {
    $(this).html("注册");
    $("#logon .logon-btn").html("登录");
    clearInputData();
  }
})
// 按下登陆或注册按钮时
$("#logon .logon-btn").on("click", function () {
  // 为空时
  if (!$(".zhanghao").val() || !$(".mima").val()) {
    showLogonMes("请输入账号或密码");
  }
  // 登录功能
  else if ($(this).html() == "登录") {
    let managedUsers = JSON.parse(localStorage.getItem("managed-users")) || [];
    // 账号已经登陆时
    if (managedUsers.includes($(".zhanghao").val())) {
      showLogonMes("该账号已处于登录状态");
      clearInputData();
    }
    // 账号不存在时
    else if (!getUsersArr().includes($(".zhanghao").val())) {
      showLogonMes("账号不存在！");
      clearInputData();
    }
    // 符合登录条件时
    else {
      let index = getUsersArr().indexOf($(".zhanghao").val());
      let psw = JSON.parse(localStorage.getItem("users"))[index].password;
      // 成功登录
      if (psw == $(".mima").val()) {
        $("#logon").modal("hide");
        showMes("登录成功！");
        // 写入本地存储
        let arr = JSON.parse(localStorage.getItem("managed-users")) || [];
        arr.push($(".zhanghao").val());
        localStorage.setItem("managed-users", JSON.stringify(arr));
        localStorage.setItem("now-user", $(".zhanghao").val());
        $(".user").html($(".zhanghao").val());
        clearInputData();
        loadUsersManagementList();
      }
      // 密码错误
      else {
        showLogonMes("密码错误！");
      }
    }
  }
  // 注册功能
  else {
    let reg = /^[a-zA-Z0-9_]{3,16}$/;
    // 用户名已经存在
    if (getUsersArr().includes($(".zhanghao").val())) {
      showLogonMes("账号已存在！");
      clearInputData();
    }
    // 用户名不符合规范时
    else if (!reg.test($(".zhanghao").val())) {
      showLogonMes("账号由3到16位数的英文字母，数字或下划线组成！");
      clearInputData();
    }
    // 成功注册
    else {
      let data = JSON.parse(localStorage.getItem("users")) || [];
      data.push({
        user: $(".zhanghao").val(),
        password: $(".mima").val()
      })
      localStorage.setItem("users", JSON.stringify(data));
      showLogonMes("注册成功，正在返回登录页面...");
      clearInputData();
      $("#logon .toggle").html("注册");
      $("#logon .logon-btn").html("登录");

    }
  }
})
// 注销和账户切换
// 账号切换
$(".users").on("click", "li", function () {
  let str = $(this).html().replace("<span>注销</span>", "");
  localStorage.setItem("now-user", str);
  $(".user").html(str);
  $("#users-management").modal("hide");
});
// 注销
$(".users").on("click", "span", function (e) {
  e.stopPropagation()
  let str = $(this).parent().html().replace("<span>注销</span>", "");
  let arr = JSON.parse(localStorage.getItem("managed-users"));
  if (str != localStorage.getItem("now-user")) {
    removeItem(arr, str);
    localStorage.setItem("managed-users", JSON.stringify(arr));
    loadUsersManagementList();
  } else {
    removeItem(arr, str);
    localStorage.setItem("managed-users", JSON.stringify(arr));
    loadUsersManagementList();
    localStorage.removeItem("now-user");
    $(".user").html("未登录");
  }
});


// !! 用户部分结束


// !! 新建清单部分开始

// 点击新建清单
let index, color;
$(".addlist").on("click", function () {
  $("#addlistModal").modal("show");
  // 初始化序号和颜色
  index = Math.floor(Math.random() * (14 - 0 + 1) + 0)
  color = $("#addlistModal .modal-body span").eq(index).css("backgroundColor");
  // 颜色选择部分
  $("#addlistModal .modal-body span").eq(index).html(`<i class="glyphicon glyphicon-ok"></i>`).siblings().html("");
  $("#addlistModal .modal-body").on("click", "span", function (e) {
    e.stopPropagation();
    $(this).html(`<i class="glyphicon glyphicon-ok"></i>`).siblings().html("");
    index = $(this).index();
    color = $("#addlistModal .modal-body span").eq(index).css("backgroundColor");
  })
})
// 点击确认
$("#addlistModal .confirm").on("click", function (e) {
  e.stopPropagation();
  if ($("#addlistModal input").val()) {
    let li = $(`<li class="current"><span style="background-color: ${color};"></span>${$("#addlistModal input").val()}</li>`)
    $(".scalable .lists li").removeClass("current");
    $(".scalable .lists").append(li);
    $("#addlistModal input").val("");
  }
  $("#addlistModal").modal("hide");
})
// 切换效果
$(".scalable .lists").on("click", "li", function () {
  $(this).addClass("current").siblings().removeClass("current");
})

// !! 新建清单部分结束