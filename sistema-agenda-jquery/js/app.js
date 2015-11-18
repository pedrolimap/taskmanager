/**
 * Created by Pedro on 31/10/2015.
 */

/* variaveis globais */
var rootUrl = "http://localhost/sistema-agenda-server/";
var clientUrl = "http://localhost/sistema-agenda-jquery/index.php";

/* métodos globais*/
function getErrorMessage(jsonError)
{
    var msg = (JSON.parse(jsonError));
    return msg.ExceptionMessage;
}

function goPage(page)
{
    location.href = clientUrl + "?go=" + page;
}

function verifyLogin()
{
    $.cookie.json = true;
    if ($.cookie('usuario') == undefined)
    {
        goPage("login");
    }
}

function preparaData(data)
{
    data.datepicker();
    data.datepicker("option", "dateFormat", "dd/mm/yy");
    data.keypress(function(event)
    {
        event.preventDefault();
    });
}

//function getDescTipo($tipo)
//{
//    switch($tipo)
//    {
//        case "0":
//            return "tarefa_comum";
//        break;
//
//        case "1":
//            return "tarefa_delegada";
//        break;
//
//        case "2":
//            return "tarefa_delegada_finalizada";
//        break;
//    }
//}

$(document).ready(function()
{
    $("#linkSair").click(function()
    {
        $.ajax(
            {
                type: "get",
                url: rootUrl + "usuario/logout",
                success: function()
                {
                    $.removeCookie('usuario');
                    goPage("login");
                }
            }
        )
    });

    // previne que enter poste um formulário
    $(window).keydown(function(event)
    {
        if(event.keyCode == 13)
        {
            event.preventDefault();
            return false;
        }
    });
});


