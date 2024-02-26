import {User} from "../../auth/entity/user.entity";

export class CreateArticleDto {
  readonly title: string;
  readonly description: string;
  readonly publicationDate: Date;
  readonly author: User;
}
