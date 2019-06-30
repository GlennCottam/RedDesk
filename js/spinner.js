function start_spinner()
{
    return new Promise(resolve => {
        setTimeout(() => {
            $("#spinner").attr('hidden', false);
            resolve('resolved');
        }, 10);
    });
}

function stop_spinner()
{
    return new Promise(resolve => {
        setTimeout(() => {
            $("#spinner").attr('hidden', true);
            resolve('resolved');
        }, 1000);
    });
}