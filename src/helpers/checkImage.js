export default function checkImage(file, maxSize = 10) {

    let allowedExtension = ['image/jpeg', 'image/jpg', 'image/png','image/gif'];
    let isImage = file.type
    if (!isImage === allowedExtension[isImage]) {
        isImage = false
        alert('You can only upload Image files!');
        console.error('You can only upload Image files!');
    }
    const isUnderSize = file.size / 1024 / 1024 < maxSize; //set to 10 MB
    if (!isUnderSize) {
        alert(`Image must smaller than ${maxSize}MB!`);
        console.error(`Image must smaller than ${maxSize}MB!`);
    }
    return isImage && isUnderSize;
}