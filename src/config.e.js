export default {
    apiAddress: "http://127.0.0.1:1323",
    menu: [
        {title: "Home", url: "/"},
        {title: "Server", url: "/Server"},
        {title: "Certificate", url: "/Certificate"}
    ],
    command: {
        upgrade: 5201,
        stop: 5202,
        sync: 5203,
        docker: {
            start: 6201,
            stop: 6202
        }
    }
}