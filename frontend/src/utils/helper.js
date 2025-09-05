import moment from "moment";

export const validateEmail=(email) =>{
    const testEmail= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return testEmail.test(email);
};

export const getInitials = (name) => {
    if(!name) return "";
    const words= name.split(" ");
    let initials = "";
    for (let i=0;i<Math.min(words.length, 2);i++){
        initials+=words[i][0];
    }

    return initials.toUpperCase();
};

export const addThousandSeparator = (num) => {
    if(num ==null || isNaN(num)) return "";
    const [intergerPart, fractionalPart] = num.toString().split(".");
    const formattedInteger = intergerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
};

export const prepareExpenseBarChartData = (data=[]) => {
    const chartData=data.map((item) => ({
        category:item?.category,
        amount:item?.amount,
}));
    return chartData;
};

export const prepareIncomeBarChartData = (data=[]) => {
    const sortedData = [...data].sort((a,b)=>new Date(a.date)-new Date(b.date));

    const charData = sortedData.map((item) => ({
        month:moment(item?.date).format("Do MMM"),
        amount:item?.amount,
        source:item?.source,
    }));
    return charData;
};

export const prepareExpenceLinesCharData = (data=[]) => {
    const sortedData = [...data].sort((a,b)=>new Date(a.date)-new Date(b.date));

    const charData = sortedData.map((item) => ({
        month:moment(item?.date).format("Do MMM"),
        amount:item?.amount,
        category:item?.category,
    }));
    return charData;
}