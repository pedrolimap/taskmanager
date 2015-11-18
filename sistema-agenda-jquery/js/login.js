/**
 * Created by Pedro on 01/11/2015.
 */

$("#btnIr").click(function(event)
{
    valido = true;

    // Validando se os campos estão vazios. Callback especial chamado map, que dispara uma função para cada objeto encontrado
    // no seletor. Se o campo estiver em branco, adiciona a classe error na div pai daquele elemento, relizado pelo seletor $(this).
    $("#form-login input").map(function()
    {
        if ($(this).val().length == 0)
        {
            valido = false;
            $(this).parents("div").addClass("error");
        }
        else
        {
            $(this).parents("div").removeClass("error");
        }
    });

    if (valido)
    {
        $("#erroLoginEmpty").hide();
        $("#erroLoginServer").hide();
        $("#btnIr").addClass("disabled");
        $("#tryLogin").show();

        data = JSON.stringify({"login": $("#login").val(), "senha": $("#senha").val()});

        $.ajax(
            {
                type: "post",
                url: rootUrl + "usuario/login",
                dataType: "json",
                data: data,
                success: onSuccessLogin,
                error: onErrorLogin
            }
        );
    }
    else
    {
        $("#erroLoginServer").hide();
        $("#erroLoginEmpty").show();
    }
});

$("#btnNew").click(function(event)
{
    valido = true;
    $("#novoModal").modal('show');
    $("#salvar").click(function()
    {
        $("#form input").map(function()
        {
            if ($(this).val().length == 0)
            {
                valido = false;
                $(this).parents("div").addClass("error");
            }
            else
            {
                $(this).parents("div").removeClass("error");
            }
        });

        if(valido)
        {

            data = JSON.stringify(
                {"nome": $("#inputNome").val(),
                    "email": $("#inputEmail").val(),
                    "senha": $("#inputSenha").val(),
                    "datan": $("#inputData").val()});

            $.ajax(
                {
                    type: "post",
                    url: rootUrl + "usuario/insert",
                    dataType: "json",
                    data: data,
                    success: function()
                    {
                        $("#login").val($("#inputEmail").val());
                        $("#senha").val($("#inputSenha").val());
                        $("#novoModal").modal('hide');
                    },
                    error : onErrorLogin
                }
            );
        }
        else
        {
            $("#erroLoginServer").hide();
            $("#erroLoginEmpty").show();
        }
    });
});

// Se o login do usuário foi realizado com sucesso no servidor, o método onSuccessLogin será chamado e irá configurar o
// cookie pela função do jQuery $.cookie() e depois redireciona para a página bemVindo.
function onSuccessLogin(data)
{
    $("#tryLogin").hide();
    $("#erroLoginServer").hide();
    $("#erroLoginEmpty").hide();
    $.cookie.json = true;
    $.cookie('usuario', data.result, {expires: 1});
    goPage("bemVindo");
}

function onErrorLogin()
{
    $("#tryLogin").hide();
    $("#erroLoginServer").html("Usuário ou senha incorretos!");
    $("#erroLoginServer").show();
    $("#btnIr").removeClass("disabled");
}
