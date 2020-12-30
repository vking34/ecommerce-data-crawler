import ExcelJS from 'exceljs';

const baseDir = process.cwd() + '/uploads/';

export default async (fileName) => {
    const shopids = [];
    var workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(baseDir + fileName)
        .then(function () {
            var worksheet = workbook.getWorksheet('Sheet1');
            worksheet.eachRow({ includeEmpty: true }, function (row) {
                shopids.push(row.values[1])
            });
        });
    console.log(shopids);

    return shopids;
}