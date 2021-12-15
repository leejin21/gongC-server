import {
    Table,
    Column,
    Model,
    AllowNull,
    DataType,
} from "sequelize-typescript";

@Table({ timestamps: false })
export default class StudyStatusDay extends Model {
    // id는 자동으로 auto_increment, primarykey 설정된 채로 추가됨.

    @AllowNull(false)
    @Column(DataType.STRING)
    public userid!: string;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    public play_status!: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    public study_status!: number;

    @Column(DataType.DATEONLY)
    public time!: Date;
}
