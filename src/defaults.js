const stylesheets = [{
    href: 'https://fonts.googleapis.com/css?family=Josefin+Sans:400,700|Monda:400,700&display=swap'
}, {
    href: '/css/bootstrap.min.css'
}, {
    href: '/css/all.min.css'
}, {
    href: '/css/style.css'
}];

const scripts = [
    {
        src: "/js/jquery.js"
    },
    {
        src: "/js/bootstrap.min.js"
    }
];

const page = {
    title: 'Le bon plan'
};

module.exports = {
    stylesheets,
    scripts,
    page
};