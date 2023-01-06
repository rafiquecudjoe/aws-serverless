const { default: retrieveWeather } = require("../services/weatherService");
const joi = require('joi')


exports.getCurrenWeather = async (req, res) => {
    try {

        const validatePayload = joi.object({
            email: joi.string().required().label("City"),
        }).strict();

        if (validatePayload.validate(req.body).error) {
            return res.status(400).json(validatePayload.validate(req.body).error.details);
        }

        const data = await retrieveWeather(req.query.city)

        return res.status(200).json({ status: true, data });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};