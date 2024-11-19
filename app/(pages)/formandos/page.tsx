import LayoutPadrao from '@/app/components/LayoutPadrao/page'
import Homenagens1 from '@/app/components/Homenagens1/page'


export default function TempoDeEmpresa() {
  return (
    <LayoutPadrao>
      <Homenagens1 titulo="Nossos Formandos" tipo="formandos" />
    </LayoutPadrao>
  )
}