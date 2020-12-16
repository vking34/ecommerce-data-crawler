

export const regexPhone = (description) => {
    const r = /\d+/g;
    const phoneArr = [];
    let m;
    while ((m = r.exec(description)) != null) {
        if (m[0].length >= 10) {
            phoneArr.push(m[0]);

        }

    }
    const arrFilter = phoneArr.filter((item, index) => phoneArr.indexOf(item) === index);
    return arrFilter;
}