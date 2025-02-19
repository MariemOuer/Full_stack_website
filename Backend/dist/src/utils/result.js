"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ok = Ok;
exports.Failure = Failure;
function Ok(value) {
    return { value };
}
function Failure(error) {
    return { error };
}
