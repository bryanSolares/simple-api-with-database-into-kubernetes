"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.join(__dirname, "../.env") });
const express_1 = __importDefault(require("express"));
console.log(process.env.DB_HOST);
const PgConfig_1 = require("./PgConfig");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.get("/api/v1/health", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = {
        server: true,
        database: false,
    };
    try {
        yield PgConfig_1.pool.query("SELECT 1");
        response.database = true;
    }
    catch (error) {
        console.log("Database error");
    }
    res.json(Object.assign({ status: "ok" }, response));
}));
app.post("/api/v1/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    try {
        yield PgConfig_1.pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [name, email]);
        res.json({ status: "User created successfully" });
    }
    catch (error) {
        console.log("Database error");
        res.json({ status: "Error creating user" });
    }
}));
app.get("/api/v1/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let result;
    try {
        const { rows } = yield PgConfig_1.pool.query("SELECT * FROM users");
        result = rows;
        res.json({ status: "ok", result });
    }
    catch (error) {
        console.log("Database error");
        res.json({ status: "Error creating user" });
    }
}));
app.listen(3000, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Server is running on port 3000");
    yield (0, PgConfig_1.startConnection)();
    yield PgConfig_1.pool.query("create table if not exists users (id serial primary key, name varchar(255), email varchar(255))");
    console.log("Connection to database established");
}));
