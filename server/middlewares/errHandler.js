const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found!`)
    res.status(404)
    next(error)
}

const errHandler = (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode // If statusCode differs 200 return statusCode
    return res.status(statusCode).json({
        sucess:false,
        mes: error?.message,
    })
}

module.exports = {
    notFound,
    errHandler
}