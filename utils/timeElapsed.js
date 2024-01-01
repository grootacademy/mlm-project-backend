exports.calculateDaysElapsed = (startDate) => {
    // Parse the start date string into a Date object
    const startDateTime = new Date(startDate);

    // Use the current date as the end date
    const endDateTime = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = endDateTime - startDateTime;

    // Convert milliseconds to days
    const daysElapsed = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return daysElapsed;
}