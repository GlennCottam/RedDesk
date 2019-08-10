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

function logConsole(log, type)
{
    if(type == 'error')
    {
        console.log("%c----------------\nERROR:\n" + log + "\n----------------", "color: #FFAAAA");
    }
    if(type == 'warning')
    {
        console.log("%c----------------\nWARNING:\n" + log + "\n----------------", "color: #FFFFAA");
    }
    if(type == 'info')
    {
        console.log("%c----------------\nINFO:\n" + log + "\n----------------", "color: #AAAAFF");
    }
    if(type == null)
    {
        console.log(log);
    }
}