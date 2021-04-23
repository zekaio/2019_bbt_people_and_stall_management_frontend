import web from "./web_utils";

const URL = "/2020/staff-management/backend"; //http://localhost:8000";
// const URL = "http://localhost:8000";

var send = async (method, url, data, headers) => {
    switch (method.toUpperCase()) {
        case "POST":
            return await post(url, data, headers);
        case "GET":
            return await get(url, data, headers);
        case "PUT":
            return await put(url, data, headers);
        case "DELETE":
            return await del(url, data, headers);
    }
    return { error: true };
};

var config = (method, data, headers) => {
    headers = headers || {};
    headers["Content-Type"] = "application/json";
    var res = { method, headers };
    if (data) res["body"] = JSON.stringify(data);
    res["mode"] = "cors";
    return res;
};

var get = async (url, data, headers) => {
    if (data) {
        var arr = [];
        for (var key in data) arr.push(key + "=" + data[key]);
        url += "?" + arr.join("&");
    }
    return await _send(url, config("GET", null, headers));
};

var post = async (url, data, headers) =>
    await _send(url, config("POST", data, headers));

var put = async (url, data, headers) =>
    await _send(url, config("PUT", data, headers));

var del = async (url, data, headers) =>
    await _send(url, config("DELETE", data, headers));

var _send = async (url, config) => {
    try {
        let res = await fetch(URL + url, config);
        console.info("res of " + url, config, " → ", res);
        var json = null; // 尝试读取数据，若失败，则跳过
        try {
            json = await res.json();
        } catch (e) {}
        // 如果状态正确，返回数据
        console.info(json);
        if (res.ok) return json;
        throw json ? json.message : res.statusText;
    } catch (e) {
        web.web.showAlert(e);
        console.error(e);
        return { error: true };
    }
};

export default {
    send,
    get,
    post,
    put,
    del,
    URL
};
