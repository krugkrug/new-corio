"""Pruebas de diario.py. Ejecutar:  python3 -I -m unittest discover -s <esta carpeta>"""
import importlib.util
import unittest
from pathlib import Path

_RUTA = Path(__file__).resolve().parent / "diario.py"
_spec = importlib.util.spec_from_file_location("diario", _RUTA)
diario = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(diario)

NOTA = """# Prado

Intro suelta.

## Recap

_Actualizado: 2026-01-01_

- viejo uno
- viejo dos

## Diario

### 2026-01-01 · repo a

Entrada vieja.

### 2025-12-01 · repo b

Entrada más vieja.

## Otra sección

Texto que no se toca.
"""


class AplicarRecap(unittest.TestCase):
    def test_sustituye_el_recap_y_deja_el_resto_igual(self):
        r = diario.aplicar(NOTA, recap="- nuevo", fecha="2026-10-08")
        self.assertIn("_Actualizado: 2026-10-08_\n\n- nuevo", r)
        self.assertNotIn("viejo uno", r)
        self.assertIn("Entrada vieja.", r)
        self.assertIn("Texto que no se toca.", r)
        self.assertEqual(r.count("## Recap"), 1)

    def test_es_idempotente(self):
        una = diario.aplicar(NOTA, recap="- nuevo", fecha="2026-10-08")
        dos = diario.aplicar(una, recap="- nuevo", fecha="2026-10-08")
        self.assertEqual(una, dos)

    def test_no_duplica_la_linea_actualizado_si_claude_copia_el_recap_viejo(self):
        r = diario.aplicar(NOTA, recap="_Actualizado: 2026-01-01_\n\n- nuevo", fecha="2026-10-08")
        self.assertEqual(r.count("_Actualizado:"), 1)
        self.assertIn("_Actualizado: 2026-10-08_", r)

    def test_sin_recap_lo_inserta_antes_de_la_primera_seccion(self):
        md = "# T\n\nIntro.\n\n## 1. Spec\n\nTexto.\n"
        r = diario.aplicar(md, recap="- a", fecha="2026-10-08")
        self.assertLess(r.index("## Recap"), r.index("## 1. Spec"))
        self.assertGreater(r.index("## Recap"), r.index("Intro."))

    def test_sin_ninguna_seccion_lo_añade_al_final(self):
        r = diario.aplicar("# T\n\nSolo texto.\n", recap="- a", fecha="2026-10-08")
        self.assertTrue(r.index("Solo texto.") < r.index("## Recap"))

    def test_ignora_un_recap_dentro_de_un_bloque_de_codigo(self):
        md = "# T\n\n```\n## Recap\n```\n\n## Otra\n\nx\n"
        r = diario.aplicar(md, recap="- a", fecha="2026-10-08")
        # el del bloque de código queda intacto y el verdadero se añade antes de «## Otra»
        self.assertIn("```\n## Recap\n```", r)
        self.assertEqual(r.count("\n## Recap\n"), 2)
        self.assertLess(r.index("_Actualizado: 2026-10-08_"), r.index("## Otra"))

    def test_rechaza_titulos_dentro_del_recap(self):
        with self.assertRaises(ValueError):
            diario.aplicar(NOTA, recap="## Otro\n- a", fecha="2026-10-08")

    def test_rechaza_recap_vacio(self):
        with self.assertRaises(ValueError):
            diario.aplicar(NOTA, recap="_Actualizado: 2026-01-01_\n\n", fecha="2026-10-08")


class AplicarEntrada(unittest.TestCase):
    def test_la_entrada_nueva_va_la_primera_y_las_viejas_se_conservan_en_orden(self):
        r = diario.aplicar(NOTA, entrada="Hoy: zanja tapada.", fecha="2026-10-08", origen="repo meta")
        a, b, c = (r.index(x) for x in ("### 2026-10-08 · repo meta", "### 2026-01-01 · repo a", "### 2025-12-01 · repo b"))
        self.assertTrue(a < b < c)
        self.assertIn("Hoy: zanja tapada.", r)
        self.assertIn("Texto que no se toca.", r)

    def test_crea_el_diario_al_final_si_no_existe(self):
        r = diario.aplicar("# T\n\n## Recap\n\n- a\n", entrada="Algo.", fecha="2026-10-08", origen="x")
        self.assertTrue(r.rstrip().endswith("Algo."))
        self.assertIn("\n## Diario\n\n### 2026-10-08 · x\n", r)

    def test_permite_subtitulos_nivel_4_y_titulos_dentro_de_codigo(self):
        e = "#### Camino\n\ntexto\n\n```\n## no es un titulo\n```"
        r = diario.aplicar(NOTA, entrada=e, fecha="2026-10-08")
        self.assertIn("#### Camino", r)

    def test_rechaza_titulos_de_nivel_1_a_3_en_la_entrada(self):
        for malo in ("# a", "## a", "### a"):
            with self.assertRaises(ValueError):
                diario.aplicar(NOTA, entrada=malo + "\ntexto", fecha="2026-10-08")

    def test_rechaza_fecha_mal_formada(self):
        with self.assertRaises(ValueError):
            diario.aplicar(NOTA, entrada="x", fecha="8/10/2026")

    def test_entrada_y_recap_a_la_vez(self):
        r = diario.aplicar(NOTA, entrada="Hecho.", recap="- nuevo", fecha="2026-10-08")
        self.assertIn("- nuevo", r)
        self.assertIn("### 2026-10-08", r)
        self.assertNotIn("viejo uno", r)


class Resumen(unittest.TestCase):
    def test_muestra_recap_cabeceras_y_ultima_entrada(self):
        s = diario.resumen(NOTA)
        self.assertIn("viejo uno", s)
        self.assertIn("### 2025-12-01 · repo b", s)
        self.assertIn("Entrada vieja.", s)
        self.assertNotIn("Texto que no se toca.", s)

    def test_avisa_si_faltan_secciones(self):
        s = diario.resumen("# T\n\nx\n")
        self.assertIn("todavía no tiene sección «## Recap»", s)
        self.assertIn("todavía no tiene sección «## Diario»", s)


class NotasReales(unittest.TestCase):
    """Las notas ya preparadas del repo aceptan el recap sin perder nada más."""

    def _nota(self, nombre):
        ruta = Path(__file__).resolve().parents[6] / "home" / "notas" / nombre
        if not ruta.exists():
            self.skipTest("no está %s" % ruta)
        return ruta.read_text(encoding="utf-8")

    def test_cambiar_el_recap_solo_toca_el_recap(self):
        for nombre in ("prado-jaro.md", "cantabria-agosto-2027.md", "proyectos/prado-casa.md"):
            md = self._nota(nombre)
            nuevo = diario.aplicar(md, recap="- prueba", fecha="2030-01-01")
            antes = md.split("## Recap")[0], md.split("\n## ", 2)[-1]
            self.assertTrue(nuevo.startswith(antes[0]), nombre)
            self.assertIn("- prueba", nuevo)
            # el resto de secciones sigue ahí: mismo número de encabezados
            self.assertEqual(md.count("\n#"), nuevo.count("\n#"), nombre)


if __name__ == "__main__":
    unittest.main()
