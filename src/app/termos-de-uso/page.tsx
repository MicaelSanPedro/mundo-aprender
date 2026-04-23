import { FileText, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de Uso - Mundo Aprender",
  description: "Termos de uso da plataforma Mundo Aprender - Materiais Didáticos Divertidos",
};

export default function TermosDeUso() {
  return (
    <div className="min-h-screen bg-background">
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
            Ultima atualizacao: 23 de abril de 2025
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
          {/* Introducao */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-orange/10">
                <Shield className="h-5 w-5 text-kid-orange" />
              </span>
              <h2 className="text-xl font-bold text-foreground">1. Introducao</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              Bem-vindo(a) ao <strong>Mundo Aprender</strong>! Ao acessar e utilizar nossa plataforma,
              voce concorda integralmente com estes Termos de Uso. Recomendamos que leia este documento
              com atencao antes de prosseguir. Caso nao concorde com algum dos termos aqui descritos,
              solicitamos que nao utilize nossos servicos. A continuacao do uso da plataforma apos a
              publicacao de eventuais alteracoes implica na aceitacao automatica dos novos termos.
            </p>
          </section>

          {/* Definicoes */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-blue/10">
                <span className="text-lg font-bold text-kid-blue">2</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">2. Definicoes</h2>
            </div>
            <ul className="space-y-3 text-sm sm:text-base text-foreground/70 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Plataforma:</strong> O site e aplicativo web Mundo Aprender, disponivel
                  em mundoaprender.com, dedicado a venda de materiais didaticos para o ensino
                  fundamental e educacao infantil.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Usuario:</strong> Toda pessoa fisica que acessa, navega ou realiza compras
                  na plataforma, seja como visitante ou cliente cadastrado.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Produto:</strong> Qualquer material didatico digital ou fisico oferecido
                  para venda na plataforma, incluindo cadernos educativos, jogos, livros e
                  atividades pedagogicas.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Codigo de ativacao:</strong> Chave alfanumerica fornecida apos a compra
                  que permite ao usuario acessar e baixar o conteudo digital adquirido.
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
              O usuario concorda em utilizar a plataforma de maneira responsavel e em conformidade
              com a legislacao brasileira vigente. E expressamente proibido qualquer uso que possa
              danificar, desabilitar, sobrecarregar ou prejudicar o funcionamento da plataforma,
              incluindo, mas nao se limitando a:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-foreground/70 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-kid-red shrink-0">✗</span>
                <span>Utilizar robos, scrapers ou qualquer ferramenta automatizada para acessar o conteudo.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-red shrink-0">✗</span>
                <span>Reproduzir, copiar, distribuir ou vender os materiais adquiridos sem autorizacao expressa.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-red shrink-0">✗</span>
                <span>Tentar acessar areas restritas do sistema ou contas de outros usuarios.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-red shrink-0">✗</span>
                <span>Compartilhar codigos de ativacao com terceiros nao autorizados.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-red shrink-0">✗</span>
                <span>Publicar conteudo ofensivo, discriminatorio ou que viole direitos de terceiros.</span>
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
              Os precos dos produtos estao em Reais (BRL) e podem ser alterados a qualquer momento
              sem aviso previo. O pagamento e processado de forma segura por meio de gateways de
              pagamento certificados. Ao finalizar a compra, o usuario autoriza a cobranca no
              meio de pagamento selecionado. O processo de entrega de produtos digitais e
              iniciado apos a confirmacao do pagamento.
            </p>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              Para produtos digitais, o acesso sera liberado por meio de codigo de ativacao unico.
              Cada codigo e valido para um unico uso e esta vinculado ao produto adquirido. O prazo
              para ativacao do codigo e de 90 (noventa) dias apos a data de compra, findo o qual
              o codigo expirara sem direito a reembolso.
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
              Todo o conteudo disponivel na plataforma, incluindo textos, imagens, ilustracoes,
              logotipos, design, materiais didaticos, jogos educativos e demais elementos, e
              protegido pela legislacao brasileira de propriedade intelectual (Lei 9.610/98).
              A reproducao, distribuicao, modificacao ou utilizacao comercial de qualquer conteudo
              sem autorizacao previa e expressa constitui violacao de direitos autorais e estah
              sujeita as penalidades previstas em lei. O usuario adquire apenas o direito de uso
              pessoal e nao exclusivo dos materiais adquiridos.
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
              O Mundo Aprender se esforca para manter o conteudo atualizado e a plataforma
              funcionando corretamente. No entanto, nao garante que o servico estara disponivel
              de forma ininterrupta ou livre de erros. Nao nos responsabilizamos por danos
              diretos, indiretos, incidentais ou consequentes decorrentes do uso ou da
              impossibilidade de uso da plataforma. A plataforma destina-se a complementar a
              educacao e nao substitui a orientacao pedagogica profissional.
            </p>
          </section>

          {/* Alteracoes nos termos */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-teal/10">
                <span className="text-lg font-bold text-kid-teal">7</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">7. Alteracoes nos Termos</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              O Mundo Aprender reserva-se o direito de modificar estes Termos de Uso a qualquer
              momento, sem aviso previo. As alteracoes entram em vigor imediatamente apos a
              publicacao na plataforma. E responsabilidade do usuario verificar periodicamente
              os termos atualizados. O uso continuado da plataforma apos as modificacoes
              constitui aceitacao implicita dos novos termos.
            </p>
          </section>

          {/* Legislacao */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-blue/10">
                <span className="text-lg font-bold text-kid-blue">8</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">8. Legislacao Aplicavel</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              Estes Termos de Uso sao regidos pela legislacao brasileira. Quaisquer duvidas ou
              controversias serao submetidas ao foro da Comarca de Sao Paulo, Estado de Sao Paulo,
              com renuncia expressa a qualquer outro, por mais privilegiado que seja. Para duvidas
              ou solicitacoes, entre em contato conosco por meio dos canais disponiveis na
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
            Ver Politica de Privacidade
          </Link>
        </div>
      </div>
    </div>
  );
}
