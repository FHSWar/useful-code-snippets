// 同页面内触发下载的方法
const downloadImage = (imageUrl, name) => { // 
    fetch(imageUrl, {
        method: 'get',
        mode: 'cors',
    })
        .then((response) => response.blob())
        .then((data) => {
            const downloadUrl = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `${name}.jpeg`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
        .catch(e => {
            console.log('wrong fetch', e)
        });
};

let i = 1
function downloadSequentially() {
    // 不延时一下，一百多条链接只能下到十几条
    setTimeout(() => {
        const url = imgUrl.pop()
        console.log('i, url', i, url, imgUrl.length)
        downloadImage(url, i++)
        if (imgUrl.length) downloadSequentially()
    }, 500)
}

setTimeout(() => {
    // 域名是https的，只能下载https的，神奇规矩
    window.imgUrl = window.imgUrl.map(url => url.replace('http', 'https'))
    console.log('window.imgUrl', window.imgUrl)

    downloadSequentially()
}, 5000)
