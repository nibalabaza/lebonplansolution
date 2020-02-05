/*
 *
 * The upload and renaming are used
 * on 2 different pages 
 * 1. /signup
 * 2. /admin/products/add
 * So we use one module to be used
 * for both pages, so we can update
 * it all at once here
 *
 */
const fs = require('fs');
const multer = require('multer');

const uploader = multer({
    dest: 'public/uploads'
});


const getExtensionFromMimetype = (mimetype) => {
    const typeMap = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'application/pdf': 'pdf'
    };
    // if the type is not in the list
    // by default we make it jpg
    return typeMap[mimetype] || 'jpg';
};

const renameFile = (file, cb) => {
    // in case we rename several files (/admin/products/add)
    // we run the command 3 times, even though the user
    // uploads only 1 or 2 images. Therefore we need to
    // return the callback as success, but with null as
    // value for success
    if (typeof file === 'undefined') {
        cb(null, null);
        return;
    }
    const ext = getExtensionFromMimetype(file.mimetype);
    let serverPath = file.path + '.' + ext;
    const clientPath = serverPath.replace('public', '');
    fs.rename(file.path, serverPath, (err) => {
        if (err !== null) {
            cb(err);
            return;
        }
        cb(null, clientPath);
    });
};

// we create a function to make our controller POST /products
// easier to read because of the callback hell
const renameFiles = (files, cb) => {
    // each err has a number, so we don't erase an error
    // with a variable with the same name
    renameFile(files[0], (err1, file1) => {
        renameFile(files[1], (err2, file2) => {
            renameFile(files[2], (err3, file3) => {
                const filePathsRaw = [file1, file2, file3];
                // remove all the file that are null
                const filePaths = filePathsRaw.filter(file => {
                    return file !== null;
                });
                // ternary to return the first error of the 3 if any
                const err = err3 ? err3 : err2 ? err2 : err1 ? err1 : null;
                console.log('src/upload#renameFiles filePaths', filePaths);
                console.log('src/upload#renameFiles filePathsRaw', filePathsRaw);
                console.log('src/upload#renameFiles err3', err3);
                console.log('src/upload#renameFiles err2', err2);
                console.log('src/upload#renameFiles err1', err1);
                cb(err, filePaths);
            });
        });
    });
};

// We export an object
// This object contains a variable (uploader)
// and two functions (renameFile & renameFiles) 
module.exports = {
    uploader: uploader,
    renameFile: renameFile,
    renameFiles: renameFiles
};
