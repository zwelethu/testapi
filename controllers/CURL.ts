export class CURLState {
  constructor(public rank: number, public url: string) {
    this.available = true;
    this.endpURL = url;
    this.last_attempt = null;
    this.num_calls = 0;
    this.waiting_period = 5000;
  }
  available: Boolean;
  endpURL: string;
  last_attempt: Date | null;
  num_calls: number;
  waiting_period: number;

  updateStatus = (passed: boolean, status: number) => {
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
}
