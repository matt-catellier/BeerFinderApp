import { Injectable, Pipe } from "angular2/core";

@Pipe({
  name: "orderby"
})
@Injectable()
export class OrderByPipe {
  transform(value, args) {
    if (!args[0]) {
      return value;
    }
  }
}