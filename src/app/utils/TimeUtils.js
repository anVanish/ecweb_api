
function calculateTimeSpanHours(pastDay, currentDay){
    return (currentDay - pastDay) / (1000 * 60 * 60)
}

module.exports = {calculateTimeSpanHours}