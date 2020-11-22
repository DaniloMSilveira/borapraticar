export default function convertHourToMinutes(time) {
    const [hour, minutes] = time.split(':');
    const timeInMinutes = parseInt((hour * 60)) + parseInt(minutes);
    return timeInMinutes;
}