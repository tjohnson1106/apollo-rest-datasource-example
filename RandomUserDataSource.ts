import { RESTDataSource } from "apollo-datasource-rest";

export class RandomUserDataSource extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://randomuser.me/api/?gender=female";
  }

  async getPerson() {
    const { results } = await this.get("");
    return results;
  }
}
