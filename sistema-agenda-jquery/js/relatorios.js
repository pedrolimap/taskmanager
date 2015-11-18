/**
 * Created by Pedro on 15/11/2015.
 */
$(document).ready(function()
{
   $("#novoModal").modal('show');
});

$("#selectRelatorio").change(function()
{
    $("select option:selected").each(function() {
        if($(this).val() == 1)
        {
            $("#labelData").show();
            $("#inputData").show();
            $("#labelDataI").hide();
            $("#inputDataI").hide();
            $("#labelDataF").hide();
            $("#inputDataF").hide();
        }
        if($(this).val() == 2)
        {
            $("#labelData").hide();
            $("#inputData").hide();
            $("#labelDataI").show();
            $("#inputDataI").show();
            $("#labelDataF").show();
            $("#inputDataF").show();
        }
        if($(this).val() == 3)
        {
            $("#labelData").show();
            $("#inputData").show();
            $("#labelDataI").hide();
            $("#inputDataI").hide();
            $("#labelDataF").hide();
            $("#inputDataF").hide();
        }
    });
});

$("#processar").click(function()
{
    $("select option:selected").each(function() {
        if($(this).val() == 1)
        {

        }
        if($(this).val() == 2)
        {

        }
        if($(this).val() == 3)
        {

        }
    });
    $("#novoModal").modal('hide');
});