import { Shield, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Privacidade - Mundo Aprender",
  description: "Politica de privacidade da plataforma Mundo Aprender - Materiais Didaticos Divertidos",
};

export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Politica de Privacidade
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

        <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-kid-blue/10 shadow-lg p-6 sm:p-10 space-y-8">
          {/* Introducao */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-blue/10">
                <Lock className="h-5 w-5 text-kid-blue" />
              </span>
              <h2 className="text-xl font-bold text-foreground">1. Introducao</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              O <strong>Mundo Aprender</strong> valoriza a privacidade e a seguranca dos seus usuarios.
              Esta Politica de Privacidade descreve como coletamos, utilizamos, armazenamos e
              protegemos suas informacoes pessoais em conformidade com a Lei Geral de Protecao de
              Dados (LGPD - Lei 13.709/2018). Ao utilizar nossa plataforma, voce consente com as
              praticas descritas neste documento. Recomendamos a leitura atenta de todas as secoes
              para que voce compreenda plenamente como tratamos seus dados pessoais.
            </p>
          </section>

          {/* Dados coletados */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-orange/10">
                <span className="text-lg font-bold text-kid-orange">2</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">2. Dados Coletados</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-3">
              Podemos coletar os seguintes tipos de informacoes para garantir o funcionamento
              adequado dos nossos servicos e oferecer uma experiencia personalizada:
            </p>
            <ul className="space-y-3 text-sm sm:text-base text-foreground/70 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Dados de cadastro:</strong> Nome completo, endereco de e-mail e numero
                  de telefone fornecidos no momento da compra ou ativacao de codigo.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Dados de transacao:</strong> Historico de compras, metodos de pagamento
                  utilizados e informacoes relacionadas ao processamento de pedidos.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Dados de navegacao:</strong> Endereco IP, tipo de navegador, sistema
                  operacional, paginas visitadas e tempo de permanencia na plataforma, coletados
                  automaticamente por cookies e tecnologias similares.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Dados de uso:</strong> Produtos visualizados, codigos de ativacao
                  utilizados e interacoes com o conteudo da plataforma.
                </span>
              </li>
            </ul>
          </section>

          {/* Finalidade */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-green/10">
                <span className="text-lg font-bold text-kid-green">3</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">3. Finalidade do Tratamento</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-3">
              Os dados pessoais coletados sao utilizados exclusivamente para as seguintes finalidades:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-foreground/70 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-kid-green shrink-0">✓</span>
                <span>Processar e entregar pedidos de produtos digitais e fisicos.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-green shrink-0">✓</span>
                <span>Enviar comprovantes de compra e informacoes sobre o status de pedidos.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-green shrink-0">✓</span>
                <span>Ativar codigos de acesso ao conteudo digital adquirido.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-green shrink-0">✓</span>
                <span>Melhorar a experiencia do usuario e personalizar o conteudo oferecido.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-green shrink-0">✓</span>
                <span>Comunicar novidades, promocoes e atualizacoes da plataforma (mediante consentimento).</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-green shrink-0">✓</span>
                <span>Cumprir obrigacoes legais e regulatórias.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-green shrink-0">✓</span>
                <span>Prevenir fraudes e garantir a seguranca da plataforma e dos usuarios.</span>
              </li>
            </ul>
          </section>

          {/* Compartilhamento */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-purple/10">
                <span className="text-lg font-bold text-kid-purple">4</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">4. Compartilhamento de Dados</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              O Mundo Aprender nao vende, aluga ou compartilha seus dados pessoais com terceiros
              para fins comerciais. Seus dados podem ser compartilhados apenas com prestadores de
              servicos essenciais para o funcionamento da plataforma, como gateways de pagamento
              e servicos de e-mail, sempre sob obrigacoes contratuais de sigilo e em conformidade
              com a LGPD. Dados anonimizados podem ser utilizados para fins estatisticos e de
              melhoria dos servicos, sem possibilidade de identificacao do usuario.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-pink/10">
                <span className="text-lg font-bold text-kid-pink">5</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">5. Cookies e Tecnologias Similares</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-3">
              Utilizamos cookies e tecnologias similares para melhorar sua experiencia na plataforma.
              Os cookies utilizados incluem:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-foreground/70 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Cookies essenciais:</strong> Necessarios para o funcionamento basico da
                  plataforma, como preferencias de aceite de termos e sessao do usuario.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Cookies de desempenho:</strong> Coletam informacoes anonimas sobre como
                  os usuarios interagem com a plataforma para melhorar seu desempenho.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-orange font-bold shrink-0">•</span>
                <span>
                  <strong>Cookies de funcionalidade:</strong> Permitem lembrar preferencias do
                  usuario, como itens favoritos e dados de produtos ativados.
                </span>
              </li>
            </ul>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mt-3">
              Voce pode configurar seu navegador para recusar cookies, porem isso pode afetar
              a funcionalidade da plataforma.
            </p>
          </section>

          {/* Seguranca */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-yellow/10">
                <span className="text-lg font-bold text-kid-orange">6</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">6. Seguranca dos Dados</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              Adotamos medidas tecnicas e organizacionais adequadas para proteger seus dados
              pessoais contra acesso nao autorizado, destruicao, perdida, alteracao ou qualquer
              forma de tratamento inadequado. Estas medidas incluem encriptacao de dados em
              transito (SSL/TLS), controles de acesso restritos, monitoramento continuo de
              seguranca e backups regulares. Embora empreguemos esforcos razoaveis para proteger
              suas informacoes, nenhum sistema de seguranca e completamente infalivel, e nao
              podemos garantir absoluta seguranca dos dados transmitidos pela internet.
            </p>
          </section>

          {/* Direitos do titular */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-teal/10">
                <span className="text-lg font-bold text-kid-teal">7</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">7. Direitos do Titular dos Dados</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mb-3">
              Em conformidade com a LGPD, voce possui os seguintes direitos em relacao aos seus
              dados pessoais:
            </p>
            <ul className="space-y-2 text-sm sm:text-base text-foreground/70 leading-relaxed">
              <li className="flex gap-2">
                <span className="text-kid-blue shrink-0">→</span>
                <span><strong>Confirmacao e acesso:</strong> Confirmar a existencia e acessar seus dados pessoais.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-blue shrink-0">→</span>
                <span><strong>Correcao:</strong> Solicitar a correcao de dados incompletos, inexatos ou desatualizados.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-blue shrink-0">→</span>
                <span><strong>Anonimizacao, bloqueio ou eliminacao:</strong> Solicitar o tratamento adequado de dados desnecessarios.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-blue shrink-0">→</span>
                <span><strong>Portabilidade:</strong> Solicitar a portabilidade dos seus dados para outro fornecedor de servico.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-blue shrink-0">→</span>
                <span><strong>Revogacao do consentimento:</strong> Revogar o consentimento previamente concedido a qualquer momento.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-kid-blue shrink-0">→</span>
                <span><strong>Oposicao:</strong> Opor-se ao tratamento de dados realizado sem consentimento, caso haja irregularidade.</span>
              </li>
            </ul>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed mt-3">
              Para exercer qualquer destes direitos, entre em contato conosco pelos canais
              disponiveis na plataforma. Responderemos sua solicitacao no prazo de ate 15 dias
              uteis, conforme previsto pela LGPD.
            </p>
          </section>

          {/* Armazenamento */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-blue/10">
                <span className="text-lg font-bold text-kid-blue">8</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">8. Armazenamento de Dados</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              Seus dados pessoais serao armazenados pelo periodo necessario para cumprir as
              finalidades para as quais foram coletados, incluindo obrigacoes legais, contratuais,
              de prestacao de contas ou de requerimento. Dados de transacao serao mantidos por
              prazo minimo de 5 (cinco) anos para fins fiscais, conforme legislacao brasileira.
              Apos o termino do periodo de retencao, os dados serao eliminados de forma segura
              ou anonimizados, salvo existencia de base legal para sua manutencao.
            </p>
          </section>

          {/* Menores de idade */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-pink/10">
                <span className="text-lg font-bold text-kid-pink">9</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">9. Menores de Idade</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              O Mundo Aprender e voltado para o publico infantojuvenil, porem as compras e o
              fornecimento de dados pessoais devem ser realizados por pais, maes ou responsaveis
              legais. Ao fornecer dados de menores, o responsavel confirma que possui autoridade
              legal para conceder o consentimento em nome da crianca. Reservamo-nos o direito
              de solicitar comprovacao de responsabilidade parental quando necessario. Nao
              coletamos intencionalmente dados pessoais de menores de idade sem consentimento
              do responsavel.
            </p>
          </section>

          {/* Contato */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-kid-green/10">
                <span className="text-lg font-bold text-kid-green">10</span>
              </span>
              <h2 className="text-xl font-bold text-foreground">10. Contato</h2>
            </div>
            <p className="text-sm sm:text-base text-foreground/70 leading-relaxed">
              Para duvidas, solicitacoes ou reclamacoes relacionadas a esta Politica de
              Privacidade ou ao tratamento dos seus dados pessoais, entre em contato com nosso
              Encarregado de Protecao de Dados (DPO) pelos canais disponiveis na plataforma.
              Estamos comprometidos em atender sua solicitacao de forma rapida e transparente.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link
            href="/termos-de-uso"
            className="text-sm text-kid-blue hover:text-kid-blue/70 font-semibold transition-colors"
          >
            Ver Termos de Uso
          </Link>
        </div>
      </div>
    </div>
  );
}
