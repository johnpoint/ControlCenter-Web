var c = document.cookie.split(';');
for (let index = 0; index < c.length; index++) {
    c[index] = c[index].split('=');
}
var userjwt = "";
for (let index = 0; index < c.length; index++) {
    if (c[index][0].replace(' ', '') == "jwt") {
        userjwt = c[index][1].replace(' ', '');
    }
};
var userlevel = 2;
function checkuser() {
    if (userjwt == "") {
        if (window.location.pathname != "/login.html" && window.location.pathname != "/register.html") {
            window.location.pathname = "/login.html"
        }
    }
    $.ajax({
        "url": apiaddress + "/web/UserInfo",
        "method": "GET",
        "timeout": 0,
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer " + userjwt
        },
        success: function (data) {
            if (data["level"] != null) {
                document.getElementById("nologin_Navbar-Account").style.display = "none";
                document.getElementById("login_Navbar-Account").style.display = "";
                $('#username')[0].innerHTML = data["name"] + '  <b class="caret"></b>'
                userlevel = data["level"]
                if (userlevel <= 0) {
                    $('#console').show();
                }
            }
        },
        error: function () {
            if (window.location.pathname != "/login.html" && window.location.pathname != "/register.html") {
                alert("您的权限被改变，请重新登录")
                window.location.pathname = "/login.html"
            }
        }
    })
}
checkuser()
