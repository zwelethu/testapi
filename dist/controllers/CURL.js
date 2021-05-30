"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURLState = void 0;
class CURLState {
    constructor(order, url) {
        this.updateStatus = (passed, status) => {
            this.last_attempt = new Date();
            this.num_calls += 1;
            if (!passed && status >= 500) {
                console.log('setting availability');
                console.log(`passed`, passed);
                console.log(`status`, status);
                this.available = false;
                console.log(`this.available1`, this.available);
                setTimeout(() => (this.available = true), this.waiting_period);
                console.log(`this.available`, this.available);
            }
        };
        this.available = true;
        this.rank = order;
        this.endpURL = url;
        this.last_attempt = null;
        this.num_calls = 0;
        this.waiting_period = 5000;
    }
}
exports.CURLState = CURLState;
