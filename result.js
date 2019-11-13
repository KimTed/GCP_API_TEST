'cuse strict';

const xlsx = require('xlsx');
const getVideo = require('./storage_sample');
const getLable = require('./video_intelligence_sample');

const wait = () => {
    return new Promise(r => setTimeout(r, 20000));
};

(async () => {
    const data = [];
    const videoUrlArr = await getVideo();
    for (const ele of videoUrlArr) {
        const labelObj = await getLable(ele);
        data.push({url: ele, cLabel: labelObj.cLabel.join(', '), label: labelObj.label.join(', ')});
        await wait();
    }
    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "속성");
    xlsx.writeFile(wb, "video-labels.xlsx");
})();
