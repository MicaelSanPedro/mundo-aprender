import { FileText, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Termos de Uso - Mundo Aprender",
  description: "Termos de uso da plataforma Mundo Aprender - Materiais Didáticos Divertidos",
};

export default function TermosDeUso() {
  return (
    <div className="min-h-screen bg-background">
      <CustomCursor />
      {/* Header */}
      <div className="gradient-hero py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Termos de Uso
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
Última atualização: 23 de abril de 2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-kid-orange hover:text-kid-orange/70 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para a loja
        </Link>

        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-kid-orange/10 shadow-lg p-6 sm:p-10 space-y-8">
          {/* Introdução */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-orange/10">
                <Shield className="h-5 w-5 text-kid-orange" />
              </span>
              <h2 className="text-xl font-bold text-foreground">1. Introdução</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              Bem-vindo(a) ao <strong>Mundo Aprender</strong>! Ao acessar e utilizar nossa plataforma,
              você concorda integralmente com estes Termos de Uso. Recomendamos que leia este documento
              com atenção antes de prosseguir. Caso não concorde com algum dos termos aqui descritos,
              solicitamos que não utilize nossos serviços. A continuação do uso da plataforma após a
              publicação de eventuais alterações implica na aceitação automática dos novos termos.
            </p>
          </section>

          {/* Definições */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-blue/10">
                <span className="text-lg font-bold text-kid-blue">2</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">2. Definições</h2>
            </div>
            <ul className="space-y-3 text-sm sm:text-base text-foreground/70 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Plataforma:</strong> O site e aplicativo web Mundo Aprender, disponível
                  em mundoaprender.com, dedicado à venda de materiais didáticos para o ensino
                  fundamental e educação infantil.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Usuário:</strong> Toda pessoa física que acessa, navega ou realiza compras
                  na plataforma, seja como visitante ou cliente cadastrado.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Produto:</strong> Qualquer material didático digital ou físico oferecido
                  para venda na plataforma, incluindo cadernos educativos, jogos, livros e
                  atividades pedagógicas.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Código de ativação:</strong> Chave alfanumérica fornecida após a compra
                  que permite ao usuário acessar e baixar o conteúdo digital adquirido.
                </span>
              </li>
            </ul>
          </section>

          {/* Uso da plataforma */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-green/10">
                <span className="text-lg font-bold text-kid-green">3</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">3. Uso da Plataforma</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-4">
              O usuário concorda em utilizar a plataforma de maneira responsável e em conformidade
              com a legislação brasileira vigente. É expressamente proibido qualquer uso que possa
              danificar, desabilitar, sobrecarregar ou prejudicar o funcionamento da plataforma,
              incluindo, mas não se limitando a:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-foreground/70 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-kid-red shrink-0">✗</span>
                <span>Utilizar robôs, scrapers ou qualquer ferramenta automatizada para acessar o conteúdo.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-red shrink-0">✗</span>
                <span>Reproduzir, copiar, distribuir ou vender os materiais adquiridos sem autorização expressa.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-red shrink-0">✗</span>
                <span>Tentar acessar áreas restritas do sistema ou contas de outros usuários.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-red shrink-0">✗</span>
                <span>Compartilhar códigos de ativação com terceiros não autorizados.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-red shrink-0">✗</span>
                <span>Publicar conteúdo ofensivo, discriminatório ou que viole direitos de terceiros.</span>
              </li>
            </ul>
          </section>

          {/* Compras e pagamentos */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-purple/10">
                <span className="text-lg font-bold text-kid-purple">4</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">4. Compras e Pagamentos</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-3">
              Os preços dos produtos estão em Reais (BRL) e podem ser alterados a qualquer momento
              sem aviso prévio. O pagamento é processado de forma segura por meio de gateways de
              pagamento certificados. Ao finalizar a compra, o usuário autoriza a cobrança no
              meio de pagamento selecionado. O processo de entrega de produtos digitais é
              iniciado após a confirmação do pagamento.
            </p>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              Para produtos digitais, o acesso será liberado por meio de código de ativação único
              que permite o download do material em PDF pela plataforma MediaFire.
              Cada código é válido para um único uso e está vinculado ao produto adquirido. O prazo
              para ativação do código é de 90 (noventa) dias após a data de compra, findo o qual
              o código expirará sem direito a reembolso.
            </p>
          </section>

          {/* Propriedade intelectual */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-pink/10">
                <span className="text-lg font-bold text-kid-pink">5</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">5. Propriedade Intelectual</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              Todo o conteúdo disponível na plataforma, incluindo textos, imagens, ilustrações,
              logotipos, design, materiais didáticos, jogos educativos e demais elementos, é
              protegido pela legislação brasileira de propriedade intelectual (Lei 9.610/98).
              A reprodução, distribuição, modificação ou utilização comercial de qualquer conteúdo
              sem autorização prévia e expressa constitui violação de direitos autorais e está
              sujeita às penalidades previstas em lei. O usuário adquire apenas o direito de uso
              pessoal e não exclusivo dos materiais adquiridos.
            </p>
          </section>

          {/* Limitacao de responsabilidade */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-yellow/10">
                <span className="text-lg font-bold text-kid-orange">6</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">6. Limitacao de Responsabilidade</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              O Mundo Aprender se esforça para manter o conteúdo atualizado e a plataforma
              funcionando corretamente. No entanto, não garante que o serviço estará disponível
              de forma ininterrupta ou livre de erros. Não nos responsabilizamos por danos
              diretos, indiretos, incidentais ou consequentes decorrentes do uso ou da
              impossibilidade de uso da plataforma. A plataforma destina-se a complementar a
              educação e não substitui a orientação pedagógica profissional.
            </p>
          </section>

          {/* Alterações nos termos */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-teal/10">
                <span className="text-lg font-bold text-kid-teal">7</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">7. Alterações nos Termos</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              O Mundo Aprender reserva-se o direito de modificar estes Termos de Uso a qualquer
              momento, sem aviso prévio. As alterações entram em vigor imediatamente após a
              publicação na plataforma. É responsabilidade do usuário verificar periodicamente
              os termos atualizados. O uso continuado da plataforma após as modificações
              constitui aceitação implícita dos novos termos.
            </p>
          </section>

          {/* Legislação */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-blue/10">
                <span className="text-lg font-bold text-kid-blue">8</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">8. Legislação Aplicável</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              Estes Termos de Uso são regidos pela legislação brasileira. Quaisquer dúvidas ou
              controvérsias serão submetidas ao foro da Comarca de São Paulo, Estado de São Paulo,
              com renúncia expressa a qualquer outro, por mais privilegiado que seja. Para dúvidas
              ou solicitações, entre em contato conosco por meio dos canais disponíveis na
              plataforma.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link
            href="/politica-de-privacidade"
            className="text-sm text-kid-blue hover:text-kid-blue/70 font-semibold transition-colors"
          >
            Ver Política de Privacidade
          </Link>
        </div>
      </div>
    </div>
  );
}
