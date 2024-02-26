import {User} from "../../auth/entity/user.entity";


export class UpdateArticleDto {
    readonly title?: string;
    readonly description?: string;
    readonly publicationDate?: Date;
    readonly author?: User;
    readonly content?: string;
}
