/**
 * Created by ALL on 02/11/2015.
 */

$(document).ready(function()
{
    verifyLogin();
    $("#tableTarefas").dataTable();
    var atualiza = "?normal=1";
    $("#btnNormais").click(function()
        {
            var atualiza = "?normal=1";
            atualizaGrid(atualiza);
        }
    );
    $("#btnDelegadas").click(function()
        {
            var atualiza = "?delegada=1";
            atualizaGrid(atualiza);
        }
    );
    $("#btnConcluidas").click(function()
        {
            var atualiza = "?concluida=1";
            atualizaGrid(atualiza);
        }
    );
    atualizaGrid(atualiza);
    loadUsuarios();
});

$("input[name=checkDelegada]").change(function()
{
    var $input = $(this);
    if($input.is(":checked"))
    {
        $("#textUsuario").show();
        $("#selectUsuario").show();
    }
    else
    {
        $("#textUsuario").hide();
        $("#selectUsuario").hide();
    }
});

$("input[name=checkConcluida]").change(function() {
    var $input = $( this );
    calculaPontos();
    if($input.is(":checked"))
    {
        $(".controls p").show();
        $(".controls p").html("<b>Concluindo esta tarefa ganhe: </b>"+ $("#inputPontos").val() +" <b>pontos</b>");
    }
    else
    {
        $(".controls p").hide();
    }
});

$('#btnNovo').click(function()
{
    if($("inputId").val() != "")
    {
        $("form")[0].reset();
        $("#inputId").val("");
        $("#labelConcluida").hide();
        $("#checkConcluida").hide();
        $("#errorServer").hide();
        $("#textUsuario").hide();
        $("#selectUsuario").hide();
        $(".controls p").hide();
        //$("input[name=checkDelegada]").attr("checked", true);
    }
    $("#novoModal").modal('show');
});

function calculaPontos()
{
    var pontos = $("#inputGrau").val() *10;
    $("#inputPontos").val( pontos );
}

function atualizaGrid(updat)
{
    $("#tableTarefas").find("tbody tr").remove();
    $("#tableTarefas").find("tbody").append('<tr><td colspan=10><div class="alert alert-success"><img src="img/ajax-loader.gif">Carregando...</div></td></tr>');


    var filtro = "";
    //if($("#filtrar").val() != "")
    //{
    //    filtro += $("#filtrar").val();
    //}







    $.ajax({
        type: "get",
        url: rootUrl + "tarefas/listAll" + updat,
        dataType: "json",
        success: function(data)
        {
            $("#tableTarefas").find("tbody tr").remove();
            data.result.forEach(function(tarefa)
            {
                row= "<tr>"
                        + "<td><a id='edit' href='#' data-id='" + tarefa.id_tar + "'>"+ tarefa.non_tar + "</a></td>"
                        +      "<td>"+ tarefa.gra_tar + "</td>"
                        +      "<td>" + tarefa.datf_tar + "</td>"
                        +      "<td>" + tarefa.des_tar + "</td>"
                        +      "<td>" + tarefa.tee_tar + "</td>"
                        +      "<td>" + tarefa.inf_tar + "</td>"
                        + "</td></tr>";

                $("#tableTarefas > tbody:last").append(row);
            });
        },
        error: function(result)
        {
            $("#errorLoad").html(getErrorMessage(result.responseText));
            $("#errorLoad").show();
            $("#tableTarefas").find("tbody tr").remove();
        }
    });
}

$('#salvar').click(function()
{
    var valido = true;
    $("#form input").map(function()
    {
        $(this).parents("div").removeClass("error");
    });

    if($('#inputNome').val().length == 0)
    {
        valido = false;
        $('#inputNome').parents("div").addClass("error");
    }

    if($('#inputDescricao').val().length > 2000)
    {
        valido = false;
        $('#inputNome').parents("div").addClass("error");
    }

    if(valido)
    {
        travarFormulario();

        $.cookie.json = true;
        usuario = $.cookie('usuario');
        var idUsuario = usuario.id_usu;
        var idDelegador = null;
        if($("input[id=checkDelegada]").is(':checked'))
        {
            idDelegador = idUsuario;
            idUsuario = $("#selectUsuario").val();
            var dataInicial = $("#dataInicial").val();
            var info = "Tarefa delegada pelo: " + usuario.nom_usu;
            $("#infoTarefa").val(info);
        }
        else
        {
            $("#infoTarefa").val("");
        }

        // variavel concluida igual a 0
        var concluida = 0;
        // se a input conlcuida for marcada concluida vale 1
        if($("input[id=checkConcluida]").is(':checked'))
        {
            concluida = 1;
        }

        tarefa = JSON.stringify({
            id: $("#inputId").val(),
            nome: $("#inputNome").val(),
            grau: $("#inputGrau").val(),
            pontos: $("#inputPontos").val(),
            tempoEx: $("#inputTempoExec").val(),
            dataFinal: $("#inputData").val(),
            descricao: $("#inputDescricao").val(),
            concluida: concluida,
            idUsuario: idUsuario,
            idUsuarioD: idDelegador,
            info: $("#infoTarefa").val()
        });

        if($("#inputId").val() == "")
        {
            $.ajax(
                {
                    type: "post",
                    url: rootUrl + "tarefas/insert",
                    dataType: "json",
                    data: tarefa,
                    success: function(result)
                    {
                        destravarFormulario();
                        $('#novoModal').modal("hide");
                        $("form")[0].reset();
                        atualizaGrid("?normal=1");

                    },
                    error: function(result)
                    {
                        destravarFormulario();
                        $("#errorServer").html(getErrorMessage(result.responseText));
                        $("#errorServer").show();
                    }
                });
        }
        else
        {
            $.ajax(
                {
                    type: "put",
                    url: rootUrl + "tarefas/update",
                    dataType: "json",
                    data: tarefa,
                    success: function(result)
                    {
                        destravarFormulario();
                        $('#novoModal').modal("hide");
                        $("form")[0].reset();
                        atualizaGrid("?normal=1");
                        atualizaPontos();
                    },
                    error: function(result)
                    {
                        destravarFormulario();
                        $("#errorServer").html(getErrorMessage(result.responseText));
                        $("#errorServer").show();
                    }
                });
        }
    }
    else
    {
        $("#errorEmpty").show();
        $("#erroServer").hide();
    }
});

$("#edit").live("click", function()
{

    id = $(this).attr("data-id");

    $(".controls p").hide();
    $("#errorServer").hide();
    $("#errorEmpty").hide();

    $("input[id=inputGrau]").change(function()
    {
        calculaPontos();
    });

    $.ajax({
        type: "get",
        url: rootUrl + "tarefas/list/" + id,
        dataType: "json",
        success: function(data)
        {
            tarefa = data.result;
            alert(tarefa.id_tar);
            $("#inputId").val(tarefa.id_tar);
            $("#inputNome").val(tarefa.non_tar);
            $("#inputGrau").val(tarefa.gra_tar);
            $("#inputData").val(tarefa.datf_tar);
            $("#inputTempoExec").val(tarefa.tee_tar);
            $("#inputDescricao").val(tarefa.des_tar);
            $("#input[name=checkConcluida]").attr("checked", tarefa.con_tar !=0 ? true : false);

            $("#labelConcluida").show();
            $("#checkConcluida").show();
            $("#novoModal").modal("show");
        },
        error: function(result)
        {
            $("#errorLoad").html(getErrorMessage(result.responseText));
            $("#errorLoad").show();
        }
    });
});

function travarFormulario()
{
    $("#errorEmpty").hide();
    $("form").hide();
    $("#saveMessage").show();
    $("#salvar").addClass("disabled");
    $("#clearForm").addClass("disabled");
}

function destravarFormulario()
{
    $("#errorEmpty").hide();
    $("#errorServer").hide();
    $("form").show();
    $("#saveMessage").hide();
    $("#salvar").removeClass("disabled");
    $("#clearForm").removeClass("disabled");
}

function loadUsuarios()
{
    $.ajax({
        type: "get",
        dataType: "json",
        url: rootUrl + "usuario/listAll",
        success: function(data)
        {
            selectUsuario = $("#selectUsuario");
            selectUsuario.find('option').remove().end();

            data.result.forEach(function(usuario)
            {
                //adiciona dados no dropdown de categorias
                selectUsuario.append('<option value="' + usuario.id_usu + '">' + usuario.nom_usu + '</option>');
            });
        },
        error: function(result)
        {
            $("#errorLoad").html(getErrorMessage(result.responseText));
            $("#errorLoad").show();
        }
    });
}

function atualizaPontos()
{
    $.ajax({
        type: "get",
        dataType: "json",
        url: rootUrl + "tarefas/pontos",
        success: function(data)
        {
            var pts = data.result;
            pontos = JSON.stringify({pontos: pts.pontos});
            $.ajax(
                {
                    type: "post",
                    url: rootUrl + "usuario/setPontos",
                    dataType: "json",
                    data: pontos
                });
        },
        error: function(result)
        {
            $("#errorLoad").html(getErrorMessage(result.responseText));
            $("#errorLoad").show();
        }
    });
}
