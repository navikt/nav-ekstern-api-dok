# NAV External APIs

## Maskinporten

In order to use these APIs, you need to have a Maskinporten client configured. Please refer to the [Maskinporten documentation](https://docs.digdir.no/docs/Maskinporten/maskinporten_guide_apikonsument).

## API-documentation: Health
| API                               | Swagger                                                       | Delegable |
|-----------------------------------|---------------------------------------------------------------|-----------|
| [Innsending av oppfølgingsplan](https://github.com/navikt/lps-oppfolgingsplan-mottak) | https://lps-oppfolgingsplan-mottak.ekstern.dev.nav.no/swagger | true      |


## API-documentation: Pension

| API                           | Swagger                                                                                                       | Delegable |
|-------------------------------|---------------------------------------------------------------------------------------------------------------|-----------|
| Beregn folketrygdbeholdning   | https://navikt.github.io/pensjon-ekstern-api/api/alderspensjon/folketrygdbeholdning/folketrygdbeholdning.html | false     |
| Simuler Alderspensjon V3      | https://navikt.github.io/pensjon-ekstern-api/api/alderspensjon/simulering/simulerAlderspensjonV3.html         | false     |
| Pensjonsimulator (V4)         | https://pensjonssimulator.ekstern.dev.nav.no/swagger-ui/index.html                                            | false     |
| Uføretrygd                    | https://navikt.github.io/pensjon-ekstern-api/api/uforetrygd/Uforetrygd.html                                   | false     |
| AFP Privat                    | https://navikt.github.io/pensjon-ekstern-api/api/afpprivat/AfpPrivat.html                                     | false     |
| Dokumentasjon Fellesordningen | https://navikt.github.io/pensjon-ekstern-api/fellesordningen/fellesordningen.html                             | false     |
| AfpGrunnlagBeholdning         | https://navikt.github.io/pensjon-ekstern-api/api/afpgrunnlagbeholdning/afp-grunnlag-beholdning.html           | false     |
| Ytelsehistorikk               | https://navikt.github.io/pensjon-ekstern-api/api/ytelsehistorikk/ytelsehistorikk.html                         | false 
## Testing

* [How to test delegable APIs](api-dok/teste-delegerbart-api.md)