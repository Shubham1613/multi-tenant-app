from elasticsearch import Elasticsearch

es = Elasticsearch()

def index_data(tenant, data):
    index_name = f"tenant_{tenant.schema_name}"
    es.index(index=index_name, body=data)


def search_data(tenant, query):
    index_name = f"tenant_{tenant.schema_name}"
    return es.search(index=index_name, body=query)

