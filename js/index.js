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

// !! 左侧宽度调整结束

// !! 封装移除项目的函数
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
// 加载管理用户清单
const loadUsersManagementList = () => {
  $(".users").html("");
  let arr = JSON.parse(localStorage.getItem("managed-users")) || [];
  for (let i = 0, len = arr.length; i < len; i++) {
    $(".users").append($(`<li>${arr[i]}<span>注销</span></li>`));
  }
}
// 加载用户的清单
const loadUserListContent = () => {
  $(".scalable .lists").html("");
  let arr = JSON.parse(localStorage.getItem(`${localStorage.getItem("now-user")}-lists`)) || [];
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i]["current"]) {
      let li = $(`<li class="current"><span style="background-color: ${arr[i]["color"]};"></span>${arr[i]["name"]}</li>`)
      $(".scalable .lists").append(li);
    } else {
      let li = $(`<li><span style="background-color: ${arr[i]["color"]};"></span>${arr[i]["name"]}</li>`)
      $(".scalable .lists").append(li);
    }
  }
}
// 加载清单标题
const setTitle = () => {
  let arr = JSON.parse(localStorage.getItem(`${localStorage.getItem("now-user")}-lists`)) || [];
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i]["current"]) {
      $(".main .title").html(`<p style="color: ${arr[i]["color"]}">${arr[i]["name"]}</p>`)
      break;
    }
  }
}
// 加载清单的内容
const showListCon = () => {
  $(".nopriority").html("");
  $(".better").html("");
  $(".best").html("");
  $(".done").html("");
  let arr = JSON.parse(localStorage.getItem(`${localStorage.getItem("now-user")}-lists`)) || [];
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i]["current"]) {
      for (let j = 0, len = arr[i]["content"].length; j < len; j++) {
        if (arr[i]["content"][j]["recyclebin"]) {
          continue;
        }
        if (arr[i]["content"][j]["completed"]) {
          if (arr[i]["content"][j]["priority"] == "none") {
            $(".done").prepend(`<li><span><div class="glyphicon glyphicon-ok"></div></span><em>${arr[i]["content"][j]["title"]}</em><i style="display:none">${arr[i]["content"][j]["id"]}</i></li>`);
            continue;
          }
          if (arr[i]["content"][j]["priority"] == "better") {
            $(".done").prepend(`<li><span><div class="glyphicon glyphicon-ok"></div></span><em>${arr[i]["content"][j]["title"]}</em><i style="display:none">${arr[i]["content"][j]["id"]}</i><i class="
            glyphicon glyphicon-star-empty"></i></li>`);
            continue;
          }
          if (arr[i]["content"][j]["priority"] == "best") {
            $(".done").prepend(`<li><span><div class="glyphicon glyphicon-ok"></div></span><em>${arr[i]["content"][j]["title"]}</em><i style="display:none">${arr[i]["content"][j]["id"]}</i><i class="
            glyphicon glyphicon-star"></i></li>`);
            continue;
          }
        }
        if (arr[i]["content"][j]["priority"] == "none") {
          $(".nopriority").prepend(`<li><span></span><em>${arr[i]["content"][j]["title"]}</em><i style="display:none">${arr[i]["content"][j]["id"]}</i></li>`);
          continue;
        }
        if (arr[i]["content"][j]["priority"] == "better") {
          $(".better").prepend(`<li><span></span><em>${arr[i]["content"][j]["title"]}</em><i style="display:none">${arr[i]["content"][j]["id"]}</i><i class="
          glyphicon glyphicon-star-empty"></i></li>`);
          continue;
        }
        if (arr[i]["content"][j]["priority"] == "best") {
          $(".best").prepend(`<li><span></span><em>${arr[i]["content"][j]["title"]}</em><i style="display:none">${arr[i]["content"][j]["id"]}</i><i class="
          glyphicon glyphicon-star"></i></li>`);
          continue;
        }
      }
      break;
    }
  }
}
// 显示隐藏已完成按钮
const showHideBtn = () => {
  if ($(".done").children().length) {
    $(".hidedone").css("display", "block");
  } else {
    $(".hidedone").css("display", "none");
  }
}

// 初始化用户名和清单
$(".user").html(localStorage.getItem("now-user") || "未登录");
loadUsersManagementList();
loadUserListContent();
setTitle();
showListCon();
showHideBtn();

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
        loadUserListContent();
        setTitle();
        showListCon();
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
  loadUserListContent();
  setTitle();
  showListCon();
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
    loadUserListContent();
    $(".main .title").html("<p><br /></p>");
    showListCon();
  };
});

// !! 用户部分结束


// !! 新建清单部分开始

// 获取清单名
const getUsersList = () => {
  let arr = JSON.parse(localStorage.getItem(`${$(".user").html()}-lists`)) || [];
  let arr2 = [];

  for (let i = 0, len = arr.length; i < len; i++) {
    arr2.push(arr[i]["name"]);
  }
  return arr2;
}
// 点击新建清单
let index, color, flag2 = 0;
$(".addlist").on("click", function () {
  if (flag2 == 1) {
    $("#addlistModal .modal-body").off("click");
    flag2 = 0
  }
  if (localStorage.getItem("now-user") != null) {
    $("#addlistModal").modal("show");
    // 初始化序号和颜色
    index = Math.floor(Math.random() * (14 - 0 + 1) + 0)
    color = $("#addlistModal .modal-body span").eq(index).css("backgroundColor");
    // 颜色选择部分
    $("#addlistModal .modal-body span").eq(index).html(`<i class="glyphicon glyphicon-ok"></i>`).siblings().html("");
    $("#addlistModal .modal-body").on("click", "span", function (e) {
      flag2 = 1;
      console.log(1)
      e.stopPropagation();
      $(this).html(`<i class="glyphicon glyphicon-ok"></i>`).siblings().html("");
      index = $(this).index();
      color = $("#addlistModal .modal-body span").eq(index).css("backgroundColor");
    })
  } else {
    showMes("请先登录！")
  }
});

// 点击确认
$("#addlistModal .confirm").on("click", function (e) {
  e.stopPropagation();
  $("#addlistModal").modal("hide");
  if ($("#addlistModal input").val()) {
    if (getUsersList().includes($("#addlistModal input").val())) {
      showMes("该清单已存在");
    } else {
      let arr = JSON.parse(localStorage.getItem(`${$(".user").html()}-lists`)) || [];
      if (arr.length >= 10) {
        showMes("清单数量已达上限")
      } else {
        let li = $(`<li class="current" style="display: none"><span style="background-color: ${color};"></span>${$("#addlistModal input").val()}</li>`)
        $(".scalable .lists li").removeClass("current");
        $(".scalable .lists").append(li);
        li.slideDown();
        // 进行本地存储
        let arr = JSON.parse(localStorage.getItem(`${$(".user").html()}-lists`)) || [];
        for (let i = 0, len = arr.length; i < len; i++) {
          arr[i]["current"] = false;
        }
        let obj = {
          "name": $("#addlistModal input").val(),
          "color": color,
          "content": [],
          "current": true
        };
        arr.push(obj)
        localStorage.setItem(`${$(".user").html()}-lists`, JSON.stringify(arr));
      }
    }
  }
  $("#addlistModal input").val("");
})

// 切换清单
$(".scalable .lists").on("click", "li", function () {
  let arr = JSON.parse(localStorage.getItem(`${$(".user").html()}-lists`)) || [];
  for (let i = 0, len = arr.length; i < len; i++) {
    arr[i]["current"] = false;
  }
  arr[$(this).index()]["current"] = true;
  $(".main .title").html(`<p style="color: ${arr[$(this).index()]["color"]}">${arr[$(this).index()]["name"]}</p>`);
  localStorage.setItem(`${$(".user").html()}-lists`, JSON.stringify(arr));
  $(this).addClass("current").siblings().removeClass("current");
  showListCon();
  showHideBtn();
})

// !! 新建清单部分结束

// !! 项操作开始
// 添加项
$(".main input").on("blur", function () {
  if ($(this).val().trim()) {
    let id = "";
    for (let i = 0; i < 16; i++) {
      id += Math.floor(Math.random() * (9 - 0 + 1) + 0);
    }
    let arr = JSON.parse(localStorage.getItem(`${localStorage.getItem("now-user")}-lists`)) || [];
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i]["current"]) {
        arr[i]["content"].push({
          "title": $(this).val().trim(),
          "completed": false,
          "priority": "none",
          "recyclebin": false,
          "id": id
        });
        localStorage.setItem(`${localStorage.getItem("now-user")}-lists`, JSON.stringify(arr));
        break;
      }
    }
    let li = $(`<li style="display: none"><span></span><em>${$(this).val().trim()}</em><i style="display: none">${id}</i></li>`);
    $(".nopriority").prepend(li);
    li.slideDown(function () {
      showListCon();
    });
  }
  $(this).val("");
})

// 操作项
// 封装函数
const isCompleted = (id, value) => {
  let arr = JSON.parse(localStorage.getItem(`${localStorage.getItem("now-user")}-lists`)) || [];
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i]["current"]) {
      for (let j = 0, len = arr[i]["content"].length; j < len; j++) {
        if (id == arr[i]["content"][j]["id"]) {
          arr[i]["content"][j]["completed"] = value;
          localStorage.setItem(`${localStorage.getItem("now-user")}-lists`, JSON.stringify(arr));
          return [i, j]
        }
      }
      break;
    }
  }
}
//  完成度切换
$(".listcontent").on("click", "li", function () {
  // 未完成 -> 完成
  if ($(this).parent().attr("class") != "done") {
    isCompleted($(this).children().eq(2).html(), true);
  }
  // 完成 -> 未完成
  else {
    isCompleted($(this).children().eq(2).html(), false);
  }
  showListCon();
  showHideBtn();
})

// 显示或隐藏已完成
let flag = 1;
$(".hidedone").on("click", function () {
  if (flag) {
    flag = 0;
    if ($(this).html() == "显示已完成") {
      $(this).html("隐藏已完成");
      $(".done").slideDown(function () {
        flag = 1;
      });
    } else {
      $(this).html("显示已完成");
      $(".done").slideUp(function () {
        flag = 1;
      });
    }
  }
})
// !! 项操作结束

// !! 右键菜单显示函数
$("html").on("contextmenu", function (e) {
  e.preventDefault();
})
const setRhList = (rhlist, x, y) => {
  if (y / document.body.clientHeight < 0.75) {
    rhlist.css({
      left: x + 'px',
      top: y + 'px'
    })
  } else {
    rhlist.css({
      left: x - parseInt(rhlist.css("width")) + 'px',
      top: y - parseInt(rhlist.css("height")) + 'px'
    })
  }
  rhlist.fadeIn(100);
  $("body").one('click', () => {
    if (rhlist.css("display") == "block") {
      rhlist.fadeOut(100);
    }
  });
}

// !! 查找位置
const findLocation = (value) => {
  let arr = JSON.parse(localStorage.getItem(`${localStorage.getItem("now-user")}-lists`)) || [];
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i]["current"]) {
      for (let j = 0, len = arr[i]["content"].length; j < len; j++) {
        if (value.children().eq(2).html() == arr[i]["content"][j]["id"]) {
          return [i, j];
        }
      }
      break;
    }
  }
}

// !! 清单项右键功能开始
let loca, ind, cla;
$(".listcontent").on("contextmenu", "li", function (e) {
  if ($(this).children().eq(0)[0].nodeName.toLowerCase() != "input") {
    setRhList($(".youjian"), e.clientX, e.clientY);
    loca = findLocation($(this));
    cla = $(this).parent().attr("class");
    ind = $(this).index();
  }
})
// 修改功能
$(".mc ul li:eq(0)").on("click", function () {
  let arr = JSON.parse(localStorage.getItem(`${localStorage.getItem("now-user")}-lists`));
  console.log(1)
  $(`.${cla}`).children().eq(ind).html("<input>")
  $(`.${cla}`).children().eq(ind).children().val(arr[loca[0]]["content"][loca[1]]["title"])
  $(`.${cla}`).children().eq(ind).children().focus();
  $(`.${cla}`).children().eq(ind).children().on("blur", function () {
    if (!$(`.${cla}`).children().eq(ind).children().val().trim()) {
      $(`.${cla}`).children().eq(ind).children().val(arr[loca[0]]["content"][loca[1]]["title"]);
    } else {
      arr[loca[0]]["content"][loca[1]]["title"] = $(`.${cla}`).children().eq(ind).children().val().trim();
      localStorage.setItem(`${localStorage.getItem("now-user")}-lists`, JSON.stringify(arr));
    }
    showListCon(function () {
      $(".mc ul li:eq(0)").off("click")
    });
  })
})

// 删除功能
$(".mc ul li:eq(6)").on("click", function () {
  let arr = JSON.parse(localStorage.getItem(`${localStorage.getItem("now-user")}-lists`));
  arr[loca[0]]["content"].splice(loca[1], 1);
  localStorage.setItem(`${localStorage.getItem("now-user")}-lists`, JSON.stringify(arr));
  showListCon();
  showHideBtn();
})

// 回收站
$(".mc ul li:eq(1)").on("click", function () {
  let arr = JSON.parse(localStorage.getItem(`${localStorage.getItem("now-user")}-lists`));
  arr[loca[0]]["content"][loca[1]]["recyclebin"] = true;
  localStorage.setItem(`${localStorage.getItem("now-user")}-lists`, JSON.stringify(arr));
  showListCon();
})
// 优先级功能
// 最高级
$(".mc ul li:eq(3)").on("click", function () {
  console.log(1)
  let arr = JSON.parse(localStorage.getItem(`${localStorage.getItem("now-user")}-lists`));
  arr[loca[0]]["content"][loca[1]]["priority"] = "best";
  localStorage.setItem(`${localStorage.getItem("now-user")}-lists`, JSON.stringify(arr));
  showListCon();
})
// 第二级
$(".mc ul li:eq(4)").on("click", function () {
  console.log(2)
  let arr = JSON.parse(localStorage.getItem(`${localStorage.getItem("now-user")}-lists`));
  arr[loca[0]]["content"][loca[1]]["priority"] = "better";
  localStorage.setItem(`${localStorage.getItem("now-user")}-lists`, JSON.stringify(arr));
  showListCon();

})
// 无优先级
$(".mc ul li:eq(5)").on("click", function () {
  console.log(3)
  let arr = JSON.parse(localStorage.getItem(`${localStorage.getItem("now-user")}-lists`));
  arr[loca[0]]["content"][loca[1]]["priority"] = "none";
  localStorage.setItem(`${localStorage.getItem("now-user")}-lists`, JSON.stringify(arr));
  showListCon();
})
// !! 清单项右键功能结束