import express from 'express';

const app = express();
const port = 8080;

// Cache favicon and SVG for a long time
app.use((req, res, next) => {
    if(req.url.match(/\.(?:ico|svg)/)) {
        res.setHeader('Cache-Control', 86400);
    }
    next();
});

app.use(express.static("public", {
    extensions: ['html'],
}));

app.listen(port, () => {
    console.log(`Listening on :${port}`);
});
