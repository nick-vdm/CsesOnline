def document_to_dict(doc):
    """
    Necessary because flask_hal isn't built to be compatible with blueprints...
    """
    return doc.to_dict()
