// phone regex: ^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3,4})[-. )]*(\d{3,4})[-. ]*(\d{3,4})(?: *x(\d+))?\s*$
//  ^\s*(?:\+?(\d{1,4}))?[-. (]*(\d{2,4})[-. )]*(\d{2,4})[-. ]*(\d{2,4})[-. ]*(\d{2,4})(?: *x(\d+))?$


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

const phoneNumberRegex = /(?:\+?(\d{1,4}))?[-. (]*(\d{2,4})[-. )]*(\d{2,4})[-. ]*(\d{2,4})[-. ]*(\d{2,4})(?: *x(\d+))?/g;
const phoneNumberFilter = /\D/g;
export default (description: string) => {
    let phoneNumSet = new Set();
    let phoneMatches = description.match(phoneNumberRegex);

    if(phoneMatches){
        phoneMatches.forEach(phone => {
            phoneNumSet.add(phone.replace(phoneNumberFilter, ''));
        });
    }

    return phoneNumSet;
};