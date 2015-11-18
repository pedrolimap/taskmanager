<?php
/**
 * Created by PhpStorm.
 * User: Pedro
 * Date: 31/10/2015
 * Time: 18:00
 *
 * task manager O PHP é usado apenas como template das páginas
 * funcionando da seguinte forma:
 *
 * index.php?go=<nomeDaPagina>
 *
 * nomeDaPagina será carregado como um arquivo PHP na DIV "pagina".
 * js/nomeDaPagna.js será carregado após o jquery carregar
 *
 * Todo acesso a dados é feito pelo PHP. Cada arquivo PHP possui a parte
 * HTMl e a parte JavaScript no mesmo arquivo, para facilitar
 *
 */

session_start();
if(isset($_GET["go"]))
{
    if(!file_exists($_GET["go"] . ".html"))
        $_GET["go"] = "login";
}
else
{
    $_GET["go"] = "login";
}
?>

<!DOCTYPE html>
<html>
    <head>
        <title>Task Manager</title>
        <meta http-equiv="Content-Type" content="text/html"; charset=UTF-8>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="css/bootstrap.metro.min.css" rel="stylesheet"/>
        <link href="css/bootstrap-responsive.min.css" rel="stylesheet"/>
        <link href="css/base/jquery-ui.css" rel="stylesheet"/>

        <link rel="stylesheet" href="http://cdn.datatables.net/1.10.2/css/jquery.dataTables.min.css"/>

        <!-- HTML5 shim, for IE6-8 suport of HTML5 element -->
        <!-- [if lt IE 9]-->
        <link href="css/app.css" rel="stylesheet"/>
    </head>
    <body>
        <div class="navbar navbar-inverse">
            <div class="navbar-inner">
                 <div class="container" style="width:auto">
                    <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </a>
                    <a class="brand" href="#">Task Manager</a>
                    <div class="nav-collapse">
                        <ul class="nav">
                            <?php
                            /**
                             * Montando o menu
                             */
                            function getActive($go)
                            {
                                if($go == $_GET["go"])
                                    return "class='active'";
                                return '';
                            }

                            $mensagemUsuario = "";
                            $usuario = null;

                            //Obter o cookie
                            if(isset($_COOKIE['usuario']))
                            {
                                $usuario = json_decode($_COOKIE['usuario']);
                                $mensagemUsuario = "Olá {$usuario->nom_usu} [ <a id='linkPerfil' href='index.php?go=perfil' class='navbar-link'>Perfil</a> - <a id='linkSair' href='#' class='navbar-link'>Sair</a> ] ";

                                if(!isset($_SESSION["login_id"]))
                                {
                                    $_SESSION["login_id"] = $usuario->id_usu;
                                }
                            }

                            if(isset($usuario))
                            {
                                echo "<li " . getActive('bemVindo') . "> <a href='index.php?go=bemVindo'>Home</a></li>";
                                echo "<li " . getActive('tarefas') . "> <a href='index.php?go=tarefas'>Tarefas</a></li>";
                                echo "<li " . getActive('relatórios') . "> <a href='index.php?go=relatorios'>Relatórios</a></li>";
                            }
                            ?>
                        </ul>
                        <p class="navbar-text pull-right"><?php echo $mensagemUsuario ?></p>
                    </div> <!--/.nav-collapse -->
                </div>
            </div>
        </div>

        <div class="container">
            <?php require($_GET["go"] . ".html")?>
        </div>

        <script src="js/libs/jquery.js" type="text/javascript"></script>
        <script src="js/libs/jquery-ui-1.10.0.custom.min.js" type="text/javascript"></script>
        <script src="js/libs/bootstrap.min.js" type="text/javascript"></script>
        <script src="js/libs/jquery.cookie.js" type="text/javascript"></script>

        <script type="text/javascript" src="http://cdn.datatables.net/1.10.2/js/jquery.dataTables.min.js"></script>

        <script src="js/app.js" type="text/javascript"></script>

        <!-- toda página tem seu arquivo JS relativo -->
        <script src="<?php echo 'js/' .$_GET["go"] . ".js"?>" type="text/javascript"></script>
    </body>
</html>
