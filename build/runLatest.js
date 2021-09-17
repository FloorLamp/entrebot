"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchData_1 = require("./fetchData");
(async () => {
    const data = await (0, fetchData_1.fetchRecentTransactions)();
    console.log(data.data);
})();
