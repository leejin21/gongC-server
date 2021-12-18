export interface serviceReturnForm {
    status: number;
    message: string;
    responseData: Object;
}

export const getYesterday = () => {
    let d = new Date();
    d.setDate(d.getDate() - 1);
    // d.setSeconds(59);
    // d.setMilliseconds(0);
    // d.setHours(32);
    // d.setMinutes(59);
    return d;
};

export const getLastWeekSundayThisTime = () => {
    let d = new Date();
    d.getDay();
    if (d.getDay() == 0) {
        d.setDate(d.getDate() - 7);
    }
    d.setDate(d.getDate() - d.getDay());
    console.log(d);
    return d;
};
