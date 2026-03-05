const getTestController = (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: "test api working correctly",
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { getTestController };
