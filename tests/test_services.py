from mirror_ai.services import analyze_request

def test_china_sourcing_request_preserves_explicit_product():
    result = analyze_request("I want to buy a whole podcast studio equipment from China")
    assert result["intent"] == "buy_from_china"
    assert result["fields"]["product"] == "podcast studio equipment"
    assert result["resources"]

def test_africa_trade_request():
    result = analyze_request("We produce shea butter in Tanzania and want Chinese buyers.")
    assert result["intent"] == "africa_to_global"
    assert result["fields"]["product"] == "shea butter"

def test_beijing_study_request():
    result = analyze_request("I want to study in China in Beijing.")
    assert result["intent"] == "study_in_china"
    assert result["fields"]["destination"] == "Beijing"
