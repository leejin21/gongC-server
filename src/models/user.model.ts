import {
    Table,
    Column,
    Model,
    AllowNull,
    Unique,
    DataType,
} from "sequelize-typescript";

@Table({ timestamps: false })
export default class User extends Model {
    /* 
        email password nickname rasp_token android_token
    */
    // id는 자동으로 auto_increment, primarykey 설정된 채로 추가됨.

    @AllowNull(false)
    @Unique(true)
    @Column(DataType.STRING)
    public email!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    public password!: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    public nickname!: string;

    @Unique(true)
    @AllowNull(true)
    @Column(DataType.STRING)
    public rasp_token!: string | null;

    @Unique(true)
    @AllowNull(true)
    @Column(DataType.STRING)
    public android_token!: string | null;
}
