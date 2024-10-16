<?php
include "./connection.php";

$select = "SELECT * FROM tareas";
$select_prepare = $conn->prepare($select);
$select_prepare->execute();
$resultado_select = $select_prepare->fetchAll();

// print_r($resultado_select);

// When Tarea posted
if ($_POST) {

    var_dump($_POST);

    $titulo = $_POST["titulo"];
    $descr = $_POST["descr"];
    $estado = $_POST["estado"];

    // Vencimiento es opcional.
    if ($_POST["vencimento"] !== NULL) {
        $vencimiento = $_POST["vencimiento"];

        $insert = "INSERT INTO tareas (titulo, descr, estado, vencimiento) VALUES (?,?,?,?)";
        $insert_prepare = $conn->prepare($insert);
        $insert_prepare->execute([$titulo, $descr, $estado, $vencimiento]);
    } else {
        $insert = "INSERT INTO tareas (titulo, descr, estado) VALUES (?,?,?)";
        $insert_prepare = $conn->prepare($insert);
        $insert_prepare->execute([$titulo, $descr, $estado]);
    }

    $insert_prepare = null;
    $conn = null;


    header('location:index.php');
}

?>

<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestor de Tareas</title>
    <link rel="shortcut icon" href="img/note-task-comment-message-edit-write_108613.svg" type="image/x-icon">
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <header>
         <h1>Mi Gestor de Tareas</h1>
    </header>
    <main>
        <!-- FORM -->
        <details>
            <summary>
               <h2>Añadir / Modificar tareas</h2>
            </summary>
            <section class="form">
                <!-- Update Info -->
                <?php if ($_GET) : ?>
                    <form method="GET" action="update.php">
                        <fieldset>
                            <legend>Actualiza la información</legend>
                            <!-- hidden info to get id -->
                            <input type="hidden" name="id" value='<?= $_GET['id'] ?>'>
                            <label for="titulo">Titulo: </label>
                            <input type="text" id="titulo" name="titulo" autofocus required value='<?php echo $_GET['titulo'] ?>'>
                            <label for="descr">Descripción: </label>
                            <input type="text" id="descr" name="descr" required value="<?php echo $_GET['descr'] ?>">
                            <label for="estado">Estado: </label>
                            <select name="estado" id="estado">
                                <option value="urgente" selected>Urgente</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="ejecucion">Ejecucion</option>
                                <option value="finalizada">Finalizada</option>
                            </select>
                            <label for="vencimiento">Vencimiento:</label>
                            <input type="date" name="vencimiento" id="vencimiento" value="<?php $venc = isset($_GET["vencimiento"]) ? $_GET["vencimiento"] : date("Y-m-d");
                                                                                            echo $venc; ?>">
                            <div class="buttons">
                                <button type="submit">UPDATE</button>
                                <a href="index.php">CANCELAR</a>
                            </div>
                        </fieldset>
                    </form>
                <?php endif; ?>
                <!-- New Input -->
                <?php if (!$_GET) : ?>
                    <form method="POST">
                        <fieldset>
                            <legend>Introduce los datos</legend>
                            <label for="titulo">Titulo: </label>
                            <input type="text" id="titulo" name="titulo" autofocus required>

                            <label for="descr">Descripción: </label>
                            <input type="text" id="descr" name="descr" required>

                            <label for="estado">Estado: </label>
                            <select name="estado" id="estado">
                                <option value="urgente" selected>Urgente</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="ejecucion">Ejecucion</option>
                                <option value="finalizada">Finalizada</option>
                            </select>
                            <label for="vencimiento">Vencimiento:</label>
                            <input type="date" name="vencimiento" id="vencimiento">
                            <div class="buttons">
                                <button type="submit">SUBMIT</button>
                                <button type="reset">RESET</button>
                            </div>
                        </fieldset>
                    </form>
                <?php endif; ?>
            </section>
        </details>


        <!-- SHOW -->
        <section class="tareas">
            <div class="pendiente">
                <h2>PENDIENTES</h2>
                <!-- if it's urgente-->
                <?php foreach ($resultado_select as $row) : ?>
                    <?php if ($row["estado"] == "urgente") : ?>
                        <div class="tarea urgente">
                            <h3><?php echo $row["titulo"]; ?></h3>
                            <p><?php echo $row["descr"]; ?></p>
                            <p class="ur">Urgente</p>
                            <div class="small">
                                <ul>
                                    <li><small>Fecha:<?php $fecha = $row["fecha"];
                                                        echo date("Y-m-d", strtotime($fecha)); ?></small></li>
                                    <?php if ($row["vencimiento"] !== NULL) : ?>
                                        <li><small>Hasta:<?php echo $row["vencimiento"]; ?></small></li>
                                    <?php endif; ?>
                                </ul>
                                <ul>
                                    <li>
                                        <a href="index.php?id=<?= $row["id"] ?>&titulo=<?= $row["titulo"] ?>&descr=<?= $row["descr"] ?>&vencimiento=<?= $row["vencimiento"] ?>"><i class="fa-solid fa-pencil"></i></a>
                                    </li>
                                    <li>
                                        <a href="delete.php?id=<?= $row["id"] ?>"><i class="fa-solid fa-trash-can"></i></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    <?php endif; ?>
                <?php endforeach; ?>
                <!-- if it's pendiente -->
                <?php foreach ($resultado_select as $row) : ?>
                    <?php if ($row["estado"] == "pendiente") : ?>
                        <div class="tarea">
                            <h3><?php echo $row["titulo"]; ?></h3>
                            <p><?php echo $row["descr"]; ?></p>
                            <div class="small">
                                <ul>
                                    <li><small>Fecha:<?php $fecha = $row["fecha"];
                                                        echo date("Y-m-d", strtotime($fecha)); ?></small></li>
                                    <?php if ($row["vencimiento"] !== NULL) : ?>
                                        <li><small>Hasta:<?php echo $row["vencimiento"]; ?></small></li>
                                    <?php endif; ?>
                                </ul>
                                <ul>
                                    <li>
                                        <a href="index.php?id=<?= $row["id"] ?>&titulo=<?= $row["titulo"] ?>&descr=<?= $row["descr"] ?>&vencimiento=<?= $row["vencimiento"] ?>"><i class="fa-solid fa-pencil"></i></a>
                                    </li>
                                    <li>
                                        <a href="delete.php?id=<?= $row["id"] ?>"><i class="fa-solid fa-trash-can"></i></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    <?php endif; ?>
                <?php endforeach; ?>
            </div>
            <div class="ejecucion">
                <h2>EJECUTANDO</h2>
                <?php foreach ($resultado_select as $row) : ?>
                    <?php if ($row["estado"] == "ejecucion") : ?>
                        <div class="tarea">
                            <h3><?php echo $row["titulo"]; ?></h3>
                            <p><?php echo $row["descr"]; ?></p>
                            <div class="small">
                                <ul>
                                    <li><small>Fecha:<?php $fecha = $row["fecha"];
                                                        echo date("Y-m-d", strtotime($fecha)); ?></small></li>
                                    <?php if ($row["vencimiento"] !== NULL) : ?>
                                        <li><small>Hasta:<?php echo $row["vencimiento"]; ?></small></li>
                                    <?php endif; ?>
                                </ul>
                                <ul>
                                    <li>
                                        <a href="index.php?id=<?= $row["id"] ?>&titulo=<?= $row["titulo"] ?>&descr=<?= $row["descr"] ?>&vencimiento=<?= $row["vencimiento"] ?>"><i class="fa-solid fa-pencil"></i></a>
                                    </li>
                                    <li>
                                        <a href="delete.php?id=<?= $row["id"] ?>"><i class="fa-solid fa-trash-can"></i></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    <?php endif; ?>
                <?php endforeach; ?>
            </div>
            <div class="finalizada">
                <h2>FINALIZADAS</h2>
                <?php foreach ($resultado_select as $row) : ?>
                    <?php if ($row["estado"] == "finalizada") : ?>
                        <div class="tarea">
                            <h3><?php echo $row["titulo"]; ?></h3>
                            <p><?php echo $row["descr"]; ?></p>
                            <div class="small">
                                <ul>
                                    <li><small>Fecha:<?php $fecha = $row["fecha"];
                                                        echo date("Y-m-d", strtotime($fecha)); ?></small></li>
                                    <?php if ($row["vencimiento"] !== NULL) : ?>
                                        <li><small>Hasta:<?php echo $row["vencimiento"]; ?></small></li>
                                    <?php endif; ?>
                                </ul>
                                <ul>
                                    <li>
                                        <a href="index.php?id=<?= $row["id"] ?>&titulo=<?= $row["titulo"] ?>&descr=<?= $row["descr"] ?>&vencimiento=<?= $row["vencimiento"] ?>"><i class="fa-solid fa-pencil"></i></a>
                                    </li>
                                    <li>
                                        <a href="delete.php?id=<?= $row["id"] ?>"><i class="fa-solid fa-trash-can"></i></a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    <?php endif; ?>
                <?php endforeach; ?>
            </div>
        </section>
    </main>
    <!-- Font-awesome -->
    <script src="https://kit.fontawesome.com/e26a24a7d1.js" crossorigin="anonymous"></script>
</body>

</html>